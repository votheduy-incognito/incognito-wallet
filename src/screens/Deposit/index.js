import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { connect } from 'react-redux';
import { genCentralizedDepositAddress, genERC20DepositAddress, genETHDepositAddress } from '@src/services/api/deposit';
import { CONSTANT_COMMONS } from '@src/constants';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import Deposit from './Deposit';

class DepositContainer extends Component {
  constructor() {
    super();

    this.state = {
      address: null
    };
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
  }

  render() {
    const { selectedPrivacy } = this.props;
    const { address } = this.state;

    if (!selectedPrivacy) return <LoadingContainer />;

    return (
      <Deposit selectedPrivacy={selectedPrivacy} depositAddress={address} handleGenAddress={this.getDepositAddress} />
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
