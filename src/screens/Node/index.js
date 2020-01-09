import { Alert, Button } from '@components/core';
import DialogLoader from '@components/DialogLoader';
import Device from '@models/device';
import BaseScreen from '@screens/BaseScreen';
import NodeItem from '@screens/Node/components/NodeItem';
import WelcomeNodes from '@screens/Node/components/Welcome';
import { getTokenList } from '@services/api/token';
import { ExHandler } from '@services/exception';
import linkingService from '@services/linking';
import NodeService from '@services/NodeService';
import accountService from '@services/wallet/accountService';
import { getBeaconBestStateDetail, getBlockChainInfo, getTransactionByHash, listRewardAmount } from '@services/wallet/RpcClientService';
import tokenService, { PRV } from '@services/wallet/tokenService';
import { CONSTANT_CONFIGS } from '@src/constants';
import routeNames from '@src/router/routeNames';
import APIService from '@src/services/api/miner/APIService';
import COLORS from '@src/styles/colors';
import convert from '@utils/convert';
import LocalDatabase from '@utils/LocalDatabase';
import Util from '@utils/Util';
import { onClickView } from '@utils/ViewUtil';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import Header from './Header';
import style from './style';

export const TAG = 'Node';
const BLOCK_TIME = 60 * 1000;

let allTokens = [PRV];
let beaconHeight;
let committees = {
  AutoStaking: [],
  ShardPendingValidator: {},
  CandidateShardWaitingForNextRandom: [],
  CandidateShardWaitingForCurrentRandom: [],
  ShardCommittee: {},
};
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
      loadedDevices: [],
      balancePRV:0,
      timeToUpdate: Date.now(),
      isFetching: false,
      loading: false,
      withdrawRequests: {},
    };

    this.renderNode = this.renderNode.bind(this);
  }

  async componentDidMount() {
    const { navigation } = this.props;
    this.listener = navigation.addListener('didFocus', this.handleRefresh);

    const withdrawRequests = await LocalDatabase.getWithdrawRequests();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ withdrawRequests }, this.startWithdraw);

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

  async startWithdraw() {
    const { withdrawRequests } = this.state;

    console.debug('START WITHDRAW', withdrawRequests);
    await LocalDatabase.saveWithdrawRequests(withdrawRequests);

    if (!withdrawRequests || !Object.keys(withdrawRequests).length || this.timeout) {
      return;
    }

    this.timeout = setTimeout(this.sendWithdrawTx, BLOCK_TIME);
  }

  sendWithdrawTx = async () => {
    const { wallet } = this.props;
    const { withdrawRequests, listDevice } = this.state;
    const addresses = Object.keys(withdrawRequests);
    const listAccount = await wallet.listAccount();
    const requests = addresses
      .filter(address => withdrawRequests[address].tokenIds)
      .map(address => ({
        paymentAddress: address,
        tokenIds: withdrawRequests[address].tokenIds,
        lastTokenId: withdrawRequests[address].lastTokenId,
      }));
    while (requests.length > 0) {
      const request = requests.pop();
      const { tokenIds, paymentAddress, lastTokenId } = request;

      if (lastTokenId) {
        const device = listDevice.find(item => item.PaymentAddress === paymentAddress);
        delete device.Rewards[lastTokenId];
        this.setState({ listDevice });
      }

      const tokenId = tokenIds.pop();
      const account = listAccount.find(item => item.PaymentAddress === paymentAddress);
      await accountService.createAndSendWithdrawRewardTx(tokenId, account, wallet)
        .then(res => {
          withdrawRequests[paymentAddress].lastTx = res.txId;
          withdrawRequests[paymentAddress].lastTokenId = tokenId;
        })
        .catch(() => null);

      if (tokenIds.length === 0) {
        this.waitTxComplete(paymentAddress);
      }
      await LocalDatabase.saveWithdrawRequests(withdrawRequests);
    }

    if (_.some(withdrawRequests, request => request.tokenIds.length > 0)) {
      this.timeout = setTimeout(this.sendWithdrawTx, BLOCK_TIME);
    }
  };

  async updateNodeRewards(paymentAddress) {
    const { listDevice, withdrawRequests } = this.state;
    const device = listDevice.find(item => item.PaymentAddress === paymentAddress);
    device.Rewards = {};

    await LocalDatabase.saveListDevices(listDevice);
    delete withdrawRequests[paymentAddress];
    await LocalDatabase.saveWithdrawRequests(withdrawRequests);
    this.setState({ withdrawRequests });
  }

  waitTxComplete = async (paymentAddress) => {
    const { withdrawRequests } = this.state;
    const tx = withdrawRequests[paymentAddress].lastTx;
    if (tx) {
      try {
        const res = await getTransactionByHash(tx);
        if (!res.isInMempool) {
          await this.updateNodeRewards(paymentAddress);
        }
      } catch(error) {
        await this.updateNodeRewards(paymentAddress);
      }
    }

    if (withdrawRequests[paymentAddress]) {
      this.timeout = setTimeout(() => this.waitTxComplete(paymentAddress), BLOCK_TIME);
    }

    if (Object.keys(withdrawRequests).length === 0) {
      this.timeout = null;
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

  async getFullInfo() {
    const { listDevice } = this.state;

    if (!listDevice || listDevice.length === 0) {
      return this.setState({ isFetching: false });
    }

    this.setState({ loadedDevices: [] });

    updateBeaconInfo(listDevice)
      .catch(error => new ExHandler(error).showErrorToast(true))
      .finally(() => this.setState({ isFetching: false }));
  }

  handleGetNodeInfoCompleted = async ({ device, index }) => {
    const { listDevice, loadedDevices } = this.state;

    if (device) {
      const deviceIndex = listDevice.findIndex(item => item.ProductId === device.ProductId);
      if (deviceIndex) {
        listDevice[deviceIndex] = device;
        await LocalDatabase.saveListDevices(listDevice);
      }
    }

    loadedDevices.push(index);

    this.setState({ listDevice, loadedDevices }, () => {
      if (loadedDevices.length >= listDevice.length) {
        this.startWithdraw();
      }
    });
  };

  handleRefresh = async () => {
    const { isFetching } = this.state;
    // to refresh token
    let getListNodeToRefreshToken = await APIService.getProductList(true);
    //////
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
      const { withdrawRequests = {} } = this.state;
      const account = device.Account;
      const rewards = device.Rewards;
      this.setState({ loading: true });
      if (device.IsVNode) {
        const { PaymentAddress } = (account || {});
        const tokenIds = _(Object.keys(rewards))
          .filter(id => rewards[id] > 0)
          .orderBy(id => {
            const value = rewards[id];
            const token = allTokens.find(token => token.id === id);
            return convert.toHumanAmount(value, token.pDecimals);
          })
          .value();
        withdrawRequests[PaymentAddress] = { tokenIds };
        this.setState({ withdrawRequests }, this.startWithdraw);
        const message = 'Withdrawl initiated! This process may take up to 2 hours. Please do not close the app until withdrawal is complete and your balance is updated.';
        this.showToastMessage(message);
      } else {
        await APIService.requestWithdraw({
          ProductID: device.ProductId,
          QRCode: device.qrCodeDeviceId,
          ValidatorKey: device.ValidatorKey,
          PaymentAddress: device.PaymentAddressFromServer
        });
        device.IsWithdrawable = await NodeService.isWithdrawable(device);
        const message = 'Withdrawl initiated! This process may take up to 48 hours. Please do not close the app until withdrawal is complete and your balance is updated.';
        this.showToastMessage(message);
      }
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

  renderNode({ item, index }) {
    const { wallet } = this.props;
    const {
      isFetching,
      withdrawRequests,
    } = this.state;

    return (
      <NodeItem
        wallet={wallet}
        committees={committees}
        nodeRewards={nodeRewards}
        allTokens={allTokens}
        withdrawRequests={withdrawRequests}
        item={item}
        isFetching={isFetching}
        index={index}
        onStake={this.handlePressStake}
        onUnstake={this.handlePressUnstake}
        onWithdraw={this.handlePressWithdraw}
        onRemove={this.handlePressRemoveDevice}
        onGetInfoCompleted={this.handleGetNodeInfoCompleted}
        onImport={this.importAccount}
      />
    );
  }

  render() {
    const {
      listDevice,
      isFetching,
      loading,
      loadedDevices,
    } = this.state;

    if (!isFetching && _.isEmpty(listDevice)) {
      return <WelcomeNodes
        onAddVNode={this.handleAddVirtualNodePress}
        onAddPNode={this.handleAddNodePress}
      />;
    }

    return (
      <View style={style.container}>
        <View style={style.background} />
        <Header goToScreen={this.goToScreen} isFetching={listDevice.length > loadedDevices.length || isFetching} />
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
