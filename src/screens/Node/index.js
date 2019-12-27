import _ from 'lodash';
import React from 'react';
import {FlatList, View, ScrollView, RefreshControl} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Alert, Button} from '@components/core';
import BaseScreen from '@screens/BaseScreen';
import routeNames from '@src/router/routeNames';
import APIService from '@src/services/api/miner/APIService';
import LocalDatabase from '@utils/LocalDatabase';
import Util from '@utils/Util';
import Device from '@models/device';
import {
  getBeaconBestStateDetail,
  getBlockChainInfo,
  getTransactionByHash,
  listRewardAmount
} from '@services/wallet/RpcClientService';
import VirtualNodeService from '@services/VirtualNodeService';
import tokenService, {PRV} from '@services/wallet/tokenService';
import {getTokenList} from '@services/api/token';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import NodeService from '@services/NodeService';
import {DEVICES} from '@src/constants/miner';
import {onClickView} from '@utils/ViewUtil';
import accountService from '@services/wallet/accountService';
import {ExHandler} from '@services/exception';
import DialogLoader from '@components/DialogLoader';
import WelcomeNodes from '@screens/Node/components/Welcome';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import COLORS from '@src/styles/colors';
import style from './style';
import Header from './Header';
import VNode from './components/VNode';
import PNode from './components/PNode';

export const TAG = 'Node';
const MAX_RETRY = 5;
const BLOCK_TIME = 40 * 1000;

let allTokens = [PRV];
let beaconHeight;
let committees = { AutoStaking: [], ShardPendingValidator: {}, CandidateShardWaitingForNextRandom: [], ShardCommittee: {} };
let nodeRewards = {};

const updateBeaconInfo = async (listDevice) => {
  const chainInfo = await getBlockChainInfo();
  const beacon = chainInfo.BestBlocks['-1'];
  const currentHeight = beacon.Height;
  const promises = [];

  if (currentHeight !== beaconHeight) {
    if(!listDevice.every(device => committees.AutoStaking.find(node => node.MiningPubKey.bls === device.PublicKeyMining))) {
      const cPromise = getBeaconBestStateDetail().then(data => {
        committees = data;
      });
      promises.push(cPromise);
    }

    const rPromise = listRewardAmount()
      .then(async data => {
        nodeRewards = data;
        let tokenIds = [];

        _.forEach(nodeRewards, reward => tokenIds.push(Object.keys(reward)));
        tokenIds = _.flatten(tokenIds);
        tokenIds = _.uniq(tokenIds);

        let tokenDict = tokenService.flatTokens(allTokens);
        if (tokenIds.some(id => !tokenDict[id])) {
          const pTokens = await getTokenList();
          allTokens = tokenService.mergeTokens(allTokens, pTokens);
          tokenDict = tokenService.flatTokens(allTokens);
          if (tokenIds.some(id => !tokenDict[id])) {
            const chainTokens = await tokenService.getPrivacyTokens();
            allTokens = tokenService.mergeTokens(chainTokens, allTokens);
          }
        }
      });
    promises.push(rPromise);
  }

  beaconHeight = currentHeight;

  return Promise.all(promises);
};

class Node extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      listDevice: [],
      balancePRV:0,
      timeToUpdate: Date.now(),
      isFetching: false,
      loading: false,
      withdrawing: false,
      withdrawRequests: [],
      lastWithdrawTxs: {},
    };

    this.renderNode = this.renderNode.bind(this);
  }

  async componentDidMount() {
    const { navigation } = this.props;
    this.listener = navigation.addListener('didFocus', this.handleRefresh);

    if (allTokens.length === 0) {
      allTokens.push(PRV);
    }
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
  }

  onResume = () => {
    this.handleRefresh();
  };

  async componentWillMount(){
    await this.createSignIn();
  }

  startWithdraw() {
    const { withdrawRequests } = this.state;

    if (!withdrawRequests || !Object.keys(withdrawRequests).length) {
      return;
    }

    this.setState({ withdrawing: true }, this.sendWithdrawTx);
  }

  sendWithdrawTx = async () => {
    const { wallet } = this.props;
    const { withdrawRequests, lastWithdrawTxs } = this.state;
    const addresses = Object.keys(withdrawRequests);
    const listAccount = await wallet.listAccount();
    for (const paymentAddress of addresses) {
      const tokenIds = withdrawRequests[paymentAddress];

      if (!tokenIds || !tokenIds.length) {
        delete withdrawRequests[paymentAddress];
        continue;
      }

      const tokenId = tokenIds.pop();
      const account = listAccount.find(item => item.PaymentAddress === paymentAddress);
      await accountService.createAndSendWithdrawRewardTx(tokenId, account, wallet)
        .then(res => lastWithdrawTxs[paymentAddress] = res.txId)
        .catch(() => null);

      if (!tokenIds || !tokenIds.length) {
        delete withdrawRequests[paymentAddress];
        this.waitTxComplete(paymentAddress);
      }
    }

    if (withdrawRequests && Object.keys(withdrawRequests).length > 0) {
      setTimeout(this.sendWithdrawTx, BLOCK_TIME);
    }
  };

  async updateNodeRewards(paymentAddress) {
    const { listDevice, lastWithdrawTxs } = this.state;
    const device = listDevice.find(item => item.PaymentAddress === paymentAddress);
    device.Rewards = {};

    await LocalDatabase.saveListDevices(listDevice);
    delete lastWithdrawTxs[paymentAddress];
  }

  waitTxComplete = async (paymentAddress) => {
    const { lastWithdrawTxs } = this.state;
    if (lastWithdrawTxs[paymentAddress]) {
      const tx = lastWithdrawTxs[paymentAddress];
      try {
        const res = await getTransactionByHash(tx);
        if (!res.isInMempool) {
          await this.updateNodeRewards(paymentAddress);
        }
      } catch(error) {
        await this.updateNodeRewards(paymentAddress);
      }
    }

    if (lastWithdrawTxs && Object.keys(lastWithdrawTxs).length > 0) {
      setTimeout(() => this.waitTxComplete(paymentAddress), BLOCK_TIME);
    } else {
      this.setState({ withdrawing: false });
    }
  };

  createSignIn = async () => {
    const user = await LocalDatabase.getUserInfo();
    if (_.isEmpty(user)) {
      this.setState({
        loading:true
      });
      const deviceId = DeviceInfo.getUniqueId();
      const params = {
        email: deviceId + '@minerX.com',
        password: Util.hashCode(deviceId)
      };
      let response = await APIService.signUp(params);
      if (response.status !== 1) {
        response = await APIService.signIn(params);
      }
      const { status, data } = response;
      const list = (status === 1 && await this.saveData(data)) || [];
      this.setState({
        loading: false,
        listDevice: list
      });
    }
  };

  saveData = async (data):Promise<Array<Object>> => {
    let filterProducts = [];
    if (data) {
      const {
        email,
        fullname,
        id,
        token,
        phone,
        user_hash,
        gender,
        credit,
        last_update_task,
        created_at,
        country,
        birth,
        city,
        code,
        refresh_token
      } = data;
      const user = {
        email: email,
        fullname: fullname,
        id: id,
        token: token,
        refresh_token: refresh_token,
        user_hash: user_hash,
        last_update_task: last_update_task,
        birth: birth,
        city: city,
        code: code,
        country: country,
        created_at: created_at,
        credit: credit,
        gender: gender,
        phone: phone
      };
      await LocalDatabase.saveUserInfo(JSON.stringify(user));
    }
    return filterProducts;
  };

  getPNodeInfo = async (device) => {
    await NodeService.fetchAndSavingInfoNodeStake(device);
    const actualRewards = {};
    const commission = device.CommissionFromServer;

    if (device.StakerAddress) {
      const rewards = await accountService.getRewardAmount('', device.StakerAddress, true);

      rewards[PRV.id] = rewards[PRV.symbol];
      delete rewards[PRV.symbol];

      Object.keys(rewards).forEach(key => {
        actualRewards[key] = rewards[key] * commission;
      });

      device.Rewards = actualRewards;
      device.setIsOnline(MAX_RETRY);
    } else {
      device.setIsOnline(Math.max(device.IsOnline - 1, 0));
    }

    return device;
  };

  getVNodeInfo = (device) => {
    const publicKey = device.PublicKey;

    if (publicKey) {
      device.Rewards = nodeRewards[publicKey] || {};
    }

    return device;
  };

  getNodeInfo = async (device) => {
    const { wallet } = this.props;
    let publicKey = device.PublicKey;
    let blsKey = device.PublicKeyMining;
    let newKey;

    if (device.IsVNode) {
      newKey = await VirtualNodeService.getPublicKeyMining(device);
    } else {
      newKey = await NodeService.getBLSKey(device);
    }

    if (newKey && blsKey !== newKey) {
      blsKey = newKey;
    }

    if (newKey) {
      device.setIsOnline(MAX_RETRY);
    } else {
      device.setIsOnline(Math.max(device.IsOnline - 1, 0));
    }

    console.debug('IS ONLINE', device.IsOnline);

    if (blsKey) {
      const nodeInfo = (committees.AutoStaking.find(node => node.MiningPubKey.bls === blsKey) || {});
      const isAutoStake = nodeInfo.IsAutoStake;
      const newPublicKey = nodeInfo.IncPubKey;

      if (JSON.stringify(committees.ShardPendingValidator).includes(blsKey)) {
        device.Status = 'waiting';
      } else if (JSON.stringify(committees.CandidateShardWaitingForNextRandom).includes(blsKey)) {
        device.Status = 'random';
      } else if (JSON.stringify(committees.ShardCommittee).includes(blsKey)) {
        device.Status = 'committee';
      } else {
        device.Status = null;
      }

      if (!isAutoStake) {
        device.UnstakeTx = null;
      } else {
        device.StakeTx = null;
      }

      device.PublicKeyMining = blsKey;
      device.IsAutoStake = isAutoStake;

      if (newPublicKey && newPublicKey !== publicKey) {
        publicKey = newPublicKey;
        device.Account = {};
        device.PublicKey = publicKey;
        device.StakeTx = null;
      }

      const listAccount = await wallet.listAccount();
      const rawAccount = await accountService.getAccountWithBLSPubKey(blsKey, wallet);
      device.Account = listAccount.find(item => item.AccountName === rawAccount?.name);

      if (device.Account) {
        device.ValidatorKey = device.Account.ValidatorKey;
      }
    }

    if (device.IsVNode) {
      device = this.getVNodeInfo(device);
    } else {
      device = await this.getPNodeInfo(device);
    }

    return device;
  };

  async getFullInfo() {
    const { listDevice } = this.state;

    if (!listDevice || listDevice.length === 0) {
      return this.setState({ isFetching: false });
    }

    updateBeaconInfo(listDevice)
      .then(async () => {
        const { listDevice } = this.state;
        const newListDevice = await Promise.all(listDevice.map(this.getNodeInfo));
        await LocalDatabase.saveListDevices(newListDevice);
        // await LocalDatabase.saveListToken(allTokens);
        this.setState({ listDevice: newListDevice, isFetching: false });
      })
      .catch(error => {
        this.setState({ isFetching: false });
        new ExHandler(error).showErrorToast(true);
      });
  }

  handleRefresh = async () => {
    const { isFetching } = this.state;

    let list = (await LocalDatabase.getListDevices()) || [];
    list = list.map(item => Device.getInstance(item));

    if (!isFetching && !_.isEmpty(list)) {
      this.setState({
        isFetching: true,
        isLoadMore: false,
        listDevice: list,
      }, this.getFullInfo);
    } else {
      this.setState({ listDevice: list });
    }
  };

  handleAddVirtualNodePress=()=>{
    this.goToScreen(routeNames.AddSelfNode);
  };

  handleAddNodePress=()=>{
    this.goToScreen(routeNames.GetStaredMineStake);
  };

  handlePressRemoveDevice = (item) => {
    const { listDevice } = this.state;
    Alert.alert('Confirm','Are you sure to delete this item?',[
      { text:'Yes', onPress:async () => {
        const newList = await LocalDatabase.removeDevice(item, listDevice);
        this.setState({ listDevice: newList });
      }},
      { text: 'Cancel' }
    ],{ cancelable: true });
  };

  handlePressWithdraw = onClickView(async (device) => {
    try {
      const { withdrawRequests = [] } = this.state;
      const account = device.Account;
      const rewards = device.Rewards;
      this.setState({ loading: true });
      if (device.IsVNode) {
        const { PaymentAddress } = (account || {});
        const tokenIds = withdrawRequests[PaymentAddress] || [];
        Object.keys(rewards).forEach(id => !tokenIds.includes(id) && tokenIds.push(id));
        withdrawRequests[PaymentAddress] = tokenIds;
        this.setState({ withdrawRequests }, this.startWithdraw);
      } else {
        await APIService.requestWithdraw({
          ProductID: device.ProductId,
          QRCode: device.qrCodeDeviceId,
          ValidatorKey: device.ValidatorKey,
          PaymentAddress: device.PaymentAddressFromServer
        });
      }
      const message = 'Withdrawing earnings to your Incognito Wallet. Balances will update in a few minutes.';
      this.showToastMessage(message);
    } catch(error) {
      new ExHandler(error).showErrorToast(true);
    } finally {
      this.setState({ loading: false });
    }
  });

  handlePressStake = onClickView(async (device) => {
    this.goToScreen(routeNames.AddStake, { device });
  });

  handlePressUnstake = onClickView(async (device) => {
    this.goToScreen(routeNames.Unstake, { device });
  });

  importAccount = () => {
    this.goToScreen(routeNames.ImportAccount);
  };

  renderNode({ item }) {
    const {
      isFetching,
      withdrawing,
      withdrawRequests,
      lastWithdrawTxs,
    } = this.state;

    if (item.Type === DEVICES.MINER_TYPE) {
      return (
        <PNode
          item={item}
          allTokens={allTokens}
          onImportAccount={this.importAccount}
          onWithdraw={this.handlePressWithdraw}
          isFetching={!!isFetching}
        />
      );
    }

    const account = item.Account;

    return (
      <VNode
        item={item}
        allTokens={allTokens}
        onRemoveDevice={this.handlePressRemoveDevice}
        onImportAccount={this.importAccount}
        onStake={this.handlePressStake}
        onWithdraw={this.handlePressWithdraw}
        onUnstake={this.handlePressUnstake}
        isFetching={!!isFetching}
        withdrawing={withdrawing}
        withdrawTxs={withdrawRequests[account?.PaymentAddress] || lastWithdrawTxs[account?.PaymentAddress]}
      />
    );
  }

  render() {
    const {
      listDevice,
      isFetching,
      loading,
    } = this.state;

    if (!isFetching && _.isEmpty(listDevice)) {
      return <WelcomeNodes onAddVNode={this.handleAddVirtualNodePress} onAddPNode={this.handleAddNodePress} />;
    }

    return (
      <View style={style.container}>
        <View style={style.background} />
        <Header goToScreen={this.goToScreen} isFetching={isFetching} />
        <DialogLoader loading={loading} />
        <ScrollView refreshControl={(
          <RefreshControl
            onRefresh={this.handleRefresh}
            refreshing={isFetching}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        )}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{ flexGrow: 1}]}
            style={style.list}
            data={listDevice}
            keyExtractor={item => String(item.ProductId)}
            onEndReachedThreshold={0.7}
            renderItem={this.renderNode}
          />
          <Button
            style={style.buyButton}
            title="Buy another Node"
            onPress={() => { linkingService.openUrl(CONSTANT_CONFIGS.NODE_URL); }}
          />
        </ScrollView>
      </View>
    );
  }
}

Node.propTypes = {
  wallet: PropTypes.object.isRequired,
};

Node.defaultProps = {};

const mapState = state => ({
  wallet: state.wallet,
});

export default connect(
  mapState,
  null,
)(Node);
