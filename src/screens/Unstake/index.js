import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import {connect} from 'react-redux';
import BaseScreen from '@screens/BaseScreen';
import {ExHandler} from '@services/exception';
import accountService from '@services/wallet/accountService';
import { getEstimateFeePerKB } from '@services/wallet/RpcClientService';
import { ActivityIndicator, Toast } from '@components/core';
import LocalDatabase from '@utils/LocalDatabase';
import _ from 'lodash';
import Device from '@models/device';
import Unstake from './Unstake';

export const TAG = 'Unstake';

class UnstakeContainer extends BaseScreen {
  constructor(props) {
    super(props);
    const { navigation }= props;
    const { params } = navigation.state;
    const { device } = params;

    console.debug('UNSTAKE', device);

    this.state = {
      device,
      isUnstaking: false,
    };
  }

  async componentDidMount() {
    this.getBalance().catch((error) => new ExHandler(error).showErrorToast(true));
  }

  async getBalance() {
    const { wallet } = this.props;
    const { device } = this.state;
    const account = device.Account;
    const balance = await accountService.getBalance(account, wallet);
    const data = await getEstimateFeePerKB(account.PaymentAddress);
    const fee = data.unitFee * 10;
    this.setState({ balance, fee: fee * 10 });
  }

  handleUnstake = async () => {
    const { isUnstaking } = this.state;

    if (isUnstaking) {
      return;
    }

    try {
      this.setState({ isUnstaking: true });
      const { wallet, navigation } = this.props;
      const { device, fee } = this.state;
      const account = device.Account;
      const validatorKey = account.ValidatorKey;
      const name = device.AccountName;
      const rs = await accountService.createAndSendStopAutoStakingTx(wallet, account, fee, account.PaymentAddress, validatorKey);
      const listDevice = await LocalDatabase.getListDevices()||[];
      await LocalDatabase.saveListDevices(listDevice);
      const deviceIndex =  listDevice.findIndex(item => _.isEqual(Device.getInstance(item).AccountName, name));
      listDevice[deviceIndex].minerInfo.unstakeTx = rs.txId;
      await LocalDatabase.saveListDevices(listDevice);
      Toast.showInfo('Unstaking complete.');
      navigation.goBack();
    } catch (e) {
      new ExHandler(e).showErrorToast(true);
    } finally {
      this.setState({ isUnstaking: false });
    }
  };

  render() {
    const { device, fee, isUnstaking, balance } = this.state;

    if (fee === undefined) {
      return <ActivityIndicator size="small" />;
    }

    return (
      <Unstake
        device={device}
        balance={balance}
        fee={fee}
        isUnstaking={isUnstaking}
        onUnstake={this.handleUnstake}
      />
    );
  }
}

UnstakeContainer.propTypes = {
  wallet: PropTypes.object.isRequired,
};

UnstakeContainer.defaultProps = {};

const mapStateToProps = (state) => ({
  wallet: state?.wallet,
});

export default compose(
  connect(mapStateToProps)
)(UnstakeContainer);
