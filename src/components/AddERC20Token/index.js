import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { Toast } from '@src/components/core';
import { accountSeleclor } from '@src/redux/selectors';
import { setWallet } from '@src/redux/actions/wallet';
import accountService from '@src/services/wallet/accountService';
import { detectERC20Token, addERC20Token, detectBEP2Token, addBEP2Token } from '@src/services/api/token';
import LoadingContainer from '@src/components/LoadingContainer';
import { ExHandler } from '@src/services/exception';
import AddERC20Token from './AddERC20Token';

export class AddERC20TokenContainer extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      isSearching: false,
      type: 'erc20',
    };

    this.handleSearch = debounce(this.handleSearch.bind(this), 1000);
  }


  detectErc20Token = async address => {
    try {
      if (!address) return;
      const data = await detectERC20Token(address);
      this.setState({ data });
      return data;
    } catch(e) {
      Toast.showWarning('This ERC20 token doesn\'t seem to exist. Please check and try again.');
      this.setState({ data: null });
      throw e;
    }
  };

  detectBEP2Token = async symbol => {
    try {
      const data = await detectBEP2Token(symbol);
      if (!data) {
        Toast.showWarning('This BEP2 token doesn\'t seem to exist. Please check and try again.');
      }
      this.setState({ data });
      return data;
    } catch(e) {
      Toast.showWarning('This BEP2 token doesn\'t seem to exist. Please check and try again.');
      this.setState({ data: null });
      throw e;
    }
  };

  handleAdd = async values => {
    try {
      if (!values) return;
      const { type } = this.state;
      const { account, wallet, setWallet } = this.props;
      let newPToken;

      console.log(type, values);

      if (type === 'erc20') {
        const {name, symbol, address, decimals} = values;
        const data = {
          name,
          symbol,
          contractId: address,
          decimals
        };

        newPToken = await addERC20Token(data);
        // add this new token to user following list
      } else {
        const {name, symbol, originalSymbol} = values;
        const data = {
          name,
          symbol,
          originalSymbol,
        };
        newPToken = await addBEP2Token(data);
      }


      await accountService.addFollowingTokens([newPToken.convertToToken()], account, wallet);
      // update new wallet to store
      setWallet(wallet);
      Toast.showSuccess('Success! You added a token.');
      return newPToken;
    } catch(e) {
      new ExHandler(e).showErrorToast();
      throw e;
    }
  };

  handleSearch = async (values) => {
    try {
      const { type } = this.state;
      if (type === 'erc20') {
        const { address, symbol } = values;
        // clear previous result
        this.setState({data: null, isSearching: true});

        // search by address/contractId
        if (address) {
          await this.detectErc20Token(address);
        } else if (symbol) {
          // TODO: search by symbol
        }
      } else if (type === 'bep2') {
        const { bep2symbol } = values;
        this.setState({data: null, isSearching: true});
        // symbol
        if (bep2symbol) {
          await this.detectBEP2Token(bep2symbol);
        }
      }
    } catch (e) {
      throw e;
    } finally {
      this.setState({ isSearching: false });
    }
  };

  handleChangeType = type => {
    this.setState({
      type,
      data: null,
    });
  };

  render() {
    const { data, isSearching, type } = this.state;
    const { wallet, account } = this.props;

    if (!wallet || !account) {
      return <LoadingContainer />;
    }

    return (
      <AddERC20Token
        data={data}
        isSearching={isSearching}
        onChangeType={this.handleChangeType}
        onAdd={this.handleAdd}
        onSearch={this.handleSearch}
        type={type}
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
