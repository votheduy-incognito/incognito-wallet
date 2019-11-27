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
import {modalStyle, tokenStyle, mainStyle} from '../../style';
import stylesheet from './style';

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

  clearInput = () => {
    const { onChange } = this.props;
    onChange('');
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
      <Text style={[mainStyle.textRight, { maxWidth: 160, paddingLeft: 5, alignSelf: 'flex-start' }]} numberOfLines={1}>
        {formatUtil.amount(tokenBalances[token.id], token.pDecimals || 0)}
      </Text>
    );
  }

  renderDialog() {
    const { showDialog, filteredTokens } = this.state;
    return (
      <Overlay isVisible={showDialog} overlayStyle={modalStyle.dialog} onBackdropPress={this.closeDialog}>
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
      <View style={stylesheet.token}>
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

  renderInput() {
    const { value, onChange, disabled } = this.props;
    return (
      <View style={stylesheet.inputContainer}>
        <TextInput
          keyboardType="decimal-pad"
          style={stylesheet.input}
          placeholder={onChange ? '0.0' : ''}
          placeholderTextColor={COLORS.lightGrey1}
          value={value}
          onChangeText={onChange}
          onFocus={this.focus}
          onBlur={this.blur}
          editable={!disabled}
        />
        {_.toString(value).length > 5 &&
        <TouchableOpacity style={stylesheet.clearIcon} onPress={this.clearInput}>
          <Icon
            name="cancel"
            color={COLORS.lightGrey1}
            size={18}
          />
        </TouchableOpacity>
        }
      </View>
    );
  }

  renderText() {
    const { value } = this.props;
    return (
      <Text numberOfLines={1} style={[stylesheet.input, { marginLeft: 0 }]}>
        {value}
      </Text>
    );
  }

  render() {
    const { token, onChange, tokenList, headerTitle, disabled } = this.props;
    return (
      <View style={stylesheet.wrapper}>
        <View style={stylesheet.header}>
          <Text style={stylesheet.headerTitle}>{headerTitle}</Text>
        </View>
        <View style={stylesheet.content}>
          {onChange ? this.renderInput() : this.renderText()}
          <TouchableOpacity
            onPress={this.showDialog}
            style={stylesheet.select}
            disabled={tokenList.length <= 0 || disabled}
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
  onChange: undefined,
  account: null,
  wallet: null,
  disabled: false,
};

Input.propTypes = {
  token: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  headerTitle: PropTypes.string.isRequired,
  tokenList: PropTypes.array.isRequired,
  onSelectToken: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  account: PropTypes.object,
  wallet: PropTypes.object,
  disabled: PropTypes.bool,
};

export default Input;
