import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { connect } from 'react-redux';
import { genCentralizedDepositAddress, genERC20DepositAddress, genETHDepositAddress, genERC20CentralizedDepositAddress } from '@src/services/api/deposit';
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
        // event
        if (this.__special_erc20__(selectedPrivacy?.tokenId)) {
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

  // event
  __special_erc20__ = (tokenId) => {
    return [
      '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0',
      '1ff2da446abfebea3ba30385e2ca99b0f0bbeda5c6371f4c23c939672b429a42',
      '1a32a6beaf79d435ff3b7fde2e166c2d67f61a64d4e482bb6633668516c1531f',
      '9e1142557e63fd20dee7f3c9524ffe0aa41198c494aa8d36447d12e85f0ddce7'
    ].includes(tokenId);
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
