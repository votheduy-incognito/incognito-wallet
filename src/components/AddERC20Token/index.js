import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { Toast } from '@src/components/core';
import { accountSeleclor } from '@src/redux/selectors';
import { setWallet } from '@src/redux/actions/wallet';
import accountService from '@src/services/wallet/accountService';
import { detectERC20Token, addERC20Token } from '@src/services/api/token';
import LoadingContainer from '@src/components/LoadingContainer';
import AddERC20Token from './AddERC20Token';

export class AddERC20TokenContainer extends Component {
  constructor() {
    super();
    this.state = {
      erc20Data: null,
      isSearching: false
    };

    this.detectErc20Token = debounce(this.detectErc20Token.bind(this), 1000);
  }
  

  detectErc20Token = async address => {
    try {
      if (!address) return;
      const erc20Data = await detectERC20Token(address);
      this.setState({ erc20Data });

      return erc20Data;
    } catch(e) {
      Toast.showWarning('Can not detect this ERC20 token, please check again');
      this.setState({ erc20Data: null });
      throw e;
    }
  }

  addERC20Token = async values => {
    try {
      if (!values) return;
      
      const { account, wallet, setWallet } = this.props;
      const newPToken= await addERC20Token(values);

      // add this new token to user following list
      await accountService.addFollowingTokens([newPToken.convertToToken()], account, wallet);

      // update new wallet to store
      setWallet(wallet);

      Toast.showInfo('Added new token successfully');
      return newPToken;
    } catch(e) {
      Toast.showWarning('Can not add this ERC20 token, please check again');
      throw e;
    }
  }

  handleSearch = async ({ address, symbol } = {}) => {
    try {
      // clear previous result 
      this.setState({ erc20Data: null, isSearching: true });

      // search by address/contractId
      if (address) {
        await this.detectErc20Token(address);
      } else  if (symbol) {
        // TODO: search by symbol
      }
    } catch (e) {
      throw e;
    } finally {
      this.setState({ isSearching: false });
    }
  }

  render() {
    const { erc20Data, isSearching } = this.state;
    const { wallet, account } = this.props;

    if (!wallet || !account) {
      return <LoadingContainer />;
    }

    return (
      <AddERC20Token
        erc20Data={erc20Data}
        isSearching={isSearching}
        onAddErc20Token={this.addERC20Token}
        onSearch={this.handleSearch}
      />
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
});

const mapDispatchToProps = {
  setWallet
};

AddERC20TokenContainer.propTypes = {
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  setWallet: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatchToProps)(AddERC20TokenContainer);
