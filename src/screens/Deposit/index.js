import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { connect } from 'react-redux';
import { genCentralizedDepositAddress, genERC20DepositAddress, genETHDepositAddress, genERC20CentralizedDepositAddress } from '@src/services/api/deposit';
import { getMinMaxDepositAmount } from '@src/services/api/misc';
import { CONSTANT_COMMONS } from '@src/constants';
import { specialErc20 } from '@src/utils/misc';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { ExHandler } from '@src/services/exception';
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
  }

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
        // event
        if (specialErc20(selectedPrivacy?.tokenId)) {
          address = await genERC20CentralizedDepositAddress({
            paymentAddress: selectedPrivacy?.paymentAddress,
            walletAddress: selectedPrivacy?.paymentAddress,
            tokenId: selectedPrivacy?.tokenId,
            tokenContractID: selectedPrivacy?.contractId,
            currencyType: selectedPrivacy?.currencyType,
          });
        } else {
          address = await genERC20DepositAddress({
            paymentAddress: selectedPrivacy?.paymentAddress,
            walletAddress: selectedPrivacy?.paymentAddress,
            tokenId: selectedPrivacy?.tokenId,
            tokenContractID: selectedPrivacy?.contractId,
            currencyType: selectedPrivacy?.currencyType,
          });
        }
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
  }

  render() {
    const { selectedPrivacy } = this.props;
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
};

DepositContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
};


export default connect(
  mapState,
  mapDispatch
)(DepositContainer);
