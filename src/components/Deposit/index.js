import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@components/LoadingContainer';
import { connect } from 'react-redux';
import { genCentralizedDepositAddress, genERC20DepositAddress, genETHDepositAddress } from '@services/api/deposit';
import { getMinMaxDepositAmount } from '@services/api/misc';
import {CONSTANT_COMMONS, CONSTANT_EVENTS} from '@src/constants';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { ExHandler } from '@services/exception';
import {logEvent} from '@services/firebase';
import Deposit from './Deposit';

class DepositContainer extends Component {
  constructor() {
    super();

    this.state = {
      address: null,
      min: null,
      max: null
    };
  }

  componentDidMount() {
    const { selectedPrivacy } = this.props;
    logEvent(CONSTANT_EVENTS.DEPOSIT, {
      tokenId: selectedPrivacy.tokenId,
      tokenSymbol: selectedPrivacy.symbol,
    });
  }

  getMinMaxAmount = async () => {
    try {
      const { selectedPrivacy } = this.props;
      const [min, max] = await getMinMaxDepositAmount(selectedPrivacy?.tokenId);

      this.setState({
        min, max
      });
    } catch (e) {
      new ExHandler(e, 'Can not get min/max amount to deposit').showErrorToast();
    }
  };

  getDepositAddress = async () => {
    try {
      let address;
      const { selectedPrivacy } = this.props;

      if (!selectedPrivacy?.isPToken) {
        return null;
      }

      if (selectedPrivacy?.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH) {
        address = await genETHDepositAddress({
          paymentAddress: selectedPrivacy?.paymentAddress,
          walletAddress: selectedPrivacy?.paymentAddress,
          tokenId: selectedPrivacy?.tokenId,
          currencyType: selectedPrivacy?.currencyType,
        });
      } else if (selectedPrivacy?.isErc20Token) {
        address = await genERC20DepositAddress({
          paymentAddress: selectedPrivacy?.paymentAddress,
          walletAddress: selectedPrivacy?.paymentAddress,
          tokenId: selectedPrivacy?.tokenId,
          tokenContractID: selectedPrivacy?.contractId,
          currencyType: selectedPrivacy?.currencyType,
        });
      } else {
        address = await genCentralizedDepositAddress({
          paymentAddress: selectedPrivacy?.paymentAddress,
          walletAddress: selectedPrivacy?.paymentAddress,
          tokenId: selectedPrivacy?.tokenId,
          currencyType: selectedPrivacy?.currencyType
        });
      }

      if (!address) {
        throw new Error('Can not gen new deposit address');
      }

      this.setState({ address });
      return address;
    } catch (e) {
      throw e;
    }
  };

  render() {
    const { selectedPrivacy, amount } = this.props;
    const { address, min, max } = this.state;

    if (!selectedPrivacy) return <LoadingContainer />;

    return (
      <Deposit
        selectedPrivacy={selectedPrivacy}
        depositAddress={address}
        handleGenAddress={this.getDepositAddress}
        handleGetMinMaxAmount={this.getMinMaxAmount}
        min={min}
        max={max}
        amount={amount}
      />
    );
  }
}

const mapState = state => ({
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state),
});

const mapDispatch = { };

DepositContainer.defaultProps = {
  selectedPrivacy: null,
  amount: 0,
};

DepositContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  amount: PropTypes.number,
};


export default connect(
  mapState,
  mapDispatch
)(DepositContainer);
