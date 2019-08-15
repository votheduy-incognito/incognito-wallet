import React, { Component } from 'react';
import { withNavigation, NavigationActions } from 'react-navigation';
import { Modal } from '@src/components/core';
import routeNames from '@src/router/routeNames';
import Receipt from './Receipt';
import styleSheet from './style';

let ExportCom = null;

const openReceipt = ({ txId, toAddress, fromAddress, amount, amountUnit, time, fee, feeUnit, decimals, pDecimals, title } = {}) => {
  if (typeof ExportCom?.openReceipt === 'function') {
    ExportCom.openReceipt({ txId, toAddress, fromAddress, amount, amountUnit, time, fee, feeUnit, decimals, pDecimals, title });
  }
};

const closeReceipt = () => {
  if (typeof ExportCom?.closeReceipt === 'function') {
    ExportCom.closeReceipt();
  }
};

class ReceiptModal extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      info: {}
    };
  }

  componentDidMount() {
    ExportCom = this;
  }

  openReceipt = (info) => {
    this.setState({ open: true, info });
  }

  closeReceipt = () => {
    this.setState({ open: false, info: {} });
  }

  goBackToWallet = () => {
    const { navigation } = this.props;
    this.closeReceipt();
    navigation.reset([NavigationActions.navigate({ routeName: routeNames.RootTab })], 0);
  }

  render() {
    const { open, info } = this.state;
    return (
      <Modal
        visible={open}
        presentationStyle='fullScreen'
        containerStyle={styleSheet.modalContainer}
        isShowHeader={false}
      > 
        <Receipt info={info} onBack={this.goBackToWallet} />
      </Modal>
    );
  }
}

export default withNavigation(ReceiptModal);
export {
  closeReceipt,
  openReceipt
};