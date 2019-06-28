import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { connect } from 'react-redux';
import { genDepositAddress } from '@src/services/api/deposit';
import { CONSTANT_COMMONS } from '@src/constants';
import { messageCode, createError } from '@src/services/errorHandler';
import Deposit from './Deposit';

class DepositContainer extends Component {
  constructor() {
    super();

    this.state = {
      address: null
    };
  }

  getDepositAddress = async amount => {
    try {
      const { selectedPrivacy } = this.props;
      const currencyType = CONSTANT_COMMONS.CURRENCY_TYPE_FOR_GEN_ADDRESS[selectedPrivacy?.additionalData?.currencyType];
      const address = await genDepositAddress({
        currencyType,
        amount,
        paymentAddress: selectedPrivacy?.paymentAddress
      });
      this.setState({ address });
      return address;
    } catch (e) {
      throw createError({ code: messageCode.code.gen_deposit_address_failed });
    }
  }

  render() {
    const { selectedPrivacy } = this.props;
    const { address } = this.state;

    if (!selectedPrivacy) return <LoadingContainer />;

    return (
      <Deposit depositAddress={address} handleGenAddress={this.getDepositAddress} />
    );
  }
}

const mapState = state => ({
  selectedPrivacy: state.selectedPrivacy,
});

const mapDispatch = { };

DepositContainer.defaultProps = {
  selectedPrivacy: null,
};

DepositContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
};


export default connect(
  mapState,
  mapDispatch
)(DepositContainer);
