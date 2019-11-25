import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View, Text, ActivityIndicator } from '@src/components/core';
import {TextInput, ScrollView, TouchableOpacity} from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import CryptoIcon from '@components/CryptoIcon';
import {COLORS} from '@src/styles';
import formatUtil from '@utils/format';
import accountService from '@services/wallet/accountService';
import {inputStyle, modalStyle, tokenStyle, mainStyle} from './style';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      filteredTokens: props.tokenList || [],
      tokenBalances: {},
      gettingBalance: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { tokenList } = this.props;
    if (tokenList !== prevProps.tokenList && tokenList && tokenList.length > 0) {
      this.handleSearch('');
    }
  }

  showDialog = () => {
    this.setState({
      showDialog: true,
    }, this.getBalances);
  };

  closeDialog = () => {
    this.setState({ showDialog: false });
    this.handleSearch('');
  };

  async getBalances() {
    const { account } = this.props;
    const { gettingBalance, filteredTokens } = this.state;
    if (gettingBalance || !account) {
      return;
    }

    this.setState({ gettingBalance, tokenBalances: {} });

    const promises = [];
    for (const token of filteredTokens) {
      promises.push(this.getTokenBalance(token));
    }

    await Promise.all(promises);
  }

  getTokenBalance(token) {
    const { account, wallet } = this.props;
    return accountService
      .getBalance(account, wallet, token.id)
      .then(balance => {
        const { tokenBalances } = this.state;
        tokenBalances[token.id] = balance;
        this.setState({ tokenBalances });
      })
      .catch(() => null);
  }

  selectToken = (token) => {
    const { onSelectToken } = this.props;
    const { tokenBalances } = this.state;
    this.closeDialog();
    onSelectToken(token, tokenBalances[token.id]);
  };

  handleSearch = (text) => {
    const { tokenList } = this.props;
    const searchText = text.toLowerCase();
    const filteredTokens = _.trim(searchText).length > 0 ? (tokenList || [])
      .filter(token =>
        token.name.toLowerCase().includes(_.trim(searchText)) ||
        token.symbol.toLowerCase().includes(_.trim(searchText))
      ) : tokenList;
    this.setState({ filteredTokens });
  };

  renderTokenBalance(token) {
    const { account, wallet } = this.props;
    const { tokenBalances } = this.state;

    if (!account || !wallet || !token) {
      return null;
    }

    if (tokenBalances[token.id] === undefined) {
      return <ActivityIndicator size="small" style={mainStyle.textRight} />;
    }

    return (
      <Text style={[mainStyle.textRight, { maxWidth: 130 }]} numberOfLines={1}>
        {formatUtil.amount(tokenBalances[token.id], token.pDecimals || 0)}
      </Text>
    );
  }

  renderDialog() {
    const { showDialog, filteredTokens } = this.state;
    return (
      <Overlay isVisible={showDialog} overlayStyle={modalStyle.dialog}>
        <View>
          <View style={modalStyle.header}>
            <Text>Select token</Text>
            <TouchableOpacity style={modalStyle.closeButton} onPress={this.closeDialog}>
              <Icon name="close" size={20} />
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              placeholder="Search"
              style={modalStyle.search}
              placeholderTextColor={COLORS.lightGrey1}
              onChangeText={this.handleSearch}
            />
          </View>
          <ScrollView style={modalStyle.container}>
            <View>
              {filteredTokens.map((item, index) =>(
                <TouchableOpacity
                  key={item.id}
                  style={[modalStyle.token, index === filteredTokens.length - 1 && modalStyle.lastItem]}
                  onPress={() => this.selectToken(item)}
                >
                  <CryptoIcon
                    tokenId={item.id}
                    logoStyle={tokenStyle.logo}
                    onlyDefault={!item.hasIcon}
                    containerStyle={{ width: 30, height: 30 }}
                  />
                  <View style={modalStyle.tokenInfo}>
                    <Text style={modalStyle.tokenSymbol}>{item.symbol}</Text>
                    <Text style={modalStyle.tokenName}>{item.name}</Text>
                  </View>
                  {this.renderTokenBalance(item)}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Overlay>
    );
  }

  renderToken() {
    const { token } = this.props;
    // Put token id to key of CryptoIcon to load new token image
    return (
      <View style={inputStyle.token}>
        <CryptoIcon
          key={token.id}
          tokenId={token.id}
          onlyDefault={!token.hasIcon}
          logoStyle={{ width: 20, height: 20 }}
          containerStyle={{ width: 25, height: 25 }}
        />
        <Text style={modalStyle.tokenInfo}>{token.symbol}</Text>
      </View>
    );
  }

  renderSelectButton() {
    return (
      <Text>Select a token</Text>
    );
  }

  renderBalance() {
    const { balance, token } = this.props;

    if (balance !== 'Loading' && !_.isNumber(balance)) {
      return null;
    }

    return (
      <View style={inputStyle.headerBalance}>
        <Text style={[inputStyle.headerTitle, inputStyle.headerBalanceTitle]}>Balance:</Text>
        {balance === 'Loading' ?
          <View style={inputStyle.balanceText}><ActivityIndicator size="small" /></View> : (
            <Text style={inputStyle.balanceText}>
              {formatUtil.amount(balance, token?.pDecimals)}
            </Text>
          )}
      </View>
    );
  }

  renderInput() {
    const { value, onChange } = this.props;
    return (
      <TextInput
        keyboardType="decimal-pad"
        style={inputStyle.input}
        placeholder={onChange ? '0.0' : ''}
        placeholderTextColor={COLORS.lightGrey1}
        value={value}
        onChangeText={onChange}
      />
    );
  }

  renderText() {
    const { value } = this.props;
    return (
      <Text numberOfLines={1} style={[inputStyle.input, { marginLeft: 0 }]}>
        {value}
      </Text>
    );
  }

  renderPool() {
    const { token, pool } = this.props;
    return (
      <View style={[mainStyle.textRight, mainStyle.twoColumns]}>
        <Text style={[inputStyle.headerTitle, inputStyle.headerBalanceTitle]}>Pool:</Text>
        <Text style={inputStyle.balanceText}>{pool > 0 ? formatUtil.amountFull(pool, token.pDecimals) : 0}</Text>
      </View>
    );
  }

  render() {
    const { token, onChange, tokenList, headerTitle } = this.props;
    return (
      <View style={inputStyle.wrapper}>
        <View style={inputStyle.header}>
          <Text style={inputStyle.headerTitle}>{headerTitle}</Text>
          {this.renderBalance()}
          { !onChange && this.renderPool() }
        </View>
        { !!onChange && this.renderPool() }
        <View style={inputStyle.content}>
          {onChange ? this.renderInput() : this.renderText()}
          <TouchableOpacity
            onPress={this.showDialog}
            style={inputStyle.select}
            disabled={tokenList.length <= 0}
          >
            {token ? this.renderToken() : this.renderSelectButton()}
          </TouchableOpacity>
        </View>
        {this.renderDialog()}
      </View>
    );
  }
}

Input.defaultProps = {
  token: null,
  value: undefined,
  balance: undefined,
  onChange: undefined,
  account: null,
  wallet: null,
};

Input.propTypes = {
  token: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  headerTitle: PropTypes.string.isRequired,
  tokenList: PropTypes.array.isRequired,
  onSelectToken: PropTypes.func.isRequired,
  pool: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  account: PropTypes.object,
  wallet: PropTypes.object,
};

export default Input;
