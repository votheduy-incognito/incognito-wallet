import React, { Component } from 'react';
import { Modal } from '@src/components/core';
import { COLORS } from '@src/styles';
import Receipt from './Receipt';
import styleSheet from './style';

let ExportCom = null;

const openReceipt = ({ txId, toAddress, fromAddress, amount, amountUnit, time, fee, feeUnit } = {}) => {
  if (typeof ExportCom?.openReceipt === 'function') {
    ExportCom.openReceipt({ txId, toAddress, fromAddress, amount, amountUnit, time, fee, feeUnit });
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

  render() {
    const { open, info } = this.state;
    return (
      <Modal
        visible={open}
        presentationStyle='fullScreen'
        close={this.closeReceipt}
        containerStyle={styleSheet.modalContainer}
        closeBtnColor={COLORS.white}
      > 
        <Receipt info={info} />
      </Modal>
    );
  }
}

export default ReceiptModal;
export {
  closeReceipt,
  openReceipt
};