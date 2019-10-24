import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Button, FlatList, Image, View} from '@src/components/core';
import {TouchableWithoutFeedback, Text, TextInput, ScrollView} from 'react-native';
import { Icon } from 'react-native-elements';
import {COLORS} from '@src/styles';
import incognitoBlack from '@src/assets/images/icons/incognito_black.png';
import incognitoWhite from '@src/assets/images/icons/incognito_white.png';
import otherBlack from '@src/assets/images/icons/other_token_black.png';
import otherWhite from '@src/assets/images/icons/other_token_white.png';
import sadFace from '@src/assets/images/sad_face.png';
import BackButton from '@src/components/BackButton/index';
import TokenType from '@src/components/SearchToken/TokenType';
import {TOKEN_TYPES} from '@src/constants/tokenData';
import {scaleInApp} from '@src/styles/TextStyle';
import { searchPTokenStyle, tokenTypeStyle, emptyStyle } from './styles';
import TokenItem from './TokenItem';

const TYPES = [
  {
    active: incognitoWhite,
    inactive: incognitoBlack,
    name: 'Incognito',
    value: TOKEN_TYPES.INCOGNITO,
  },
  {
    active: otherWhite,
    inactive: otherBlack,
    name: 'ERC20',
    value: TOKEN_TYPES.ERC20,
  },
  {
    active: otherWhite,
    inactive: otherBlack,
    name: 'BEP2',
    value: TOKEN_TYPES.BEP2,
  },
];

class SearchToken extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: (new Map(): Map<string, boolean>),
      filteredTokens: null,
      tokenType: 0,
      selectedItems: 0,
    };
  }

  componentDidMount() {
    this.filter();
  }

  _handleSelect = (tokenId: string) => {
    this.setState(state => {
      // copy the map rather than modifying state
      const selected = new Map(state.selected);
      const isSelected = !selected.get(tokenId);
      let { selectedItems } = state;
      selected.set(tokenId, isSelected); // toggle

      if (isSelected) {
        selectedItems++;
      } else {
        selectedItems--;
      }

      console.debug(isSelected, selectedItems);

      return { selected, selectedItems };
    });
  };

  _renderItem = ({ item }) => {
    const { selected } = this.state;
    return (
      <TokenItem
        onPress={this._handleSelect}
        token={item}
        selected={selected.get(item.tokenId)}
        divider
      />
    );
  };

  _keyExtractor = item => item.tokenId;

  filter() {
    const { tokens } = this.props;
    const { query, tokenType } = this.state;
    let filteredTokens = tokens.filter(t => t.type === tokenType);
    if (query) {
      filteredTokens = filteredTokens
        .filter(t => {
          const lowerCaseTerm = query ? String(query).toLowerCase() : query;
          const lowerCaseTokenName = [t.name, t.symbol].join(' ')?.toLowerCase();
          return lowerCaseTokenName.includes(lowerCaseTerm || '');
        });
    }
    this.setState({ filteredTokens });
  }

  handleSaveFollow = () => {
    const { handleAddFollowToken } = this.props;
    const { selected } = this.state;
    const tokenIds = [];

    selected.forEach((isSelected, tokenId) => isSelected && tokenIds.push(tokenId));

    if (tokenIds.length) {
      handleAddFollowToken(tokenIds);

      // clear
      this.setState({ selected: new Map() });
    }
  };

  handleSearch = (query) => {
    this.setState({ query }, this.filter);
  };

  handleSelectTokenType = (type) => {
    this.setState({ tokenType: type }, this.filter);
  };

  handleAddToken = () => {
    const { tokenType } = this.state;
    const { handleAddToken } = this.props;
    handleAddToken(tokenType);
  };

  renderHeader() {
    const { onCancel } = this.props;
    const { selectedItems } = this.state;
    return (
      <View style={searchPTokenStyle.header}>
        <BackButton onPress={onCancel} width={50} height={scaleInApp(35)} size={20} />
        <TextInput
          placeholder='Search for a token'
          placeholderTextColor="rgba(255, 255, 255, 0.65)"
          style={searchPTokenStyle.searchInput}
          selectionColor={COLORS.white}
          onChangeText={this.handleSearch}
        />
        <Icon name="search" containerStyle={searchPTokenStyle.inputIcon} color='white' />
        <TouchableWithoutFeedback
          disabled={selectedItems <= 0}
          onPress={this.handleSaveFollow}
        >
          <Text style={[searchPTokenStyle.cancelBtnText, selectedItems <= 0 && searchPTokenStyle.disabled]}>Add</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderTokenTypes() {
    const { tokenType } = this.state;
    return (
      <View style={tokenTypeStyle.container}>
        <Text style={tokenTypeStyle.title}>Select a network</Text>
        <View style={tokenTypeStyle.types}>
          {TYPES.map(type => (
            <TokenType
              key={type.name}
              type={type}
              isSelected={type.value === tokenType}
              onSelectType={this.handleSelectTokenType}
            />
          ))}
        </View>
      </View>
    );
  }

  renderAddTokenText() {
    const { tokenType } = this.state;
    if (tokenType === TOKEN_TYPES.INCOGNITO) {
      return 'Issue your own token';
    } else if (tokenType === TOKEN_TYPES.BEP2) {
      return 'Add a BEP2 token';
    } else if (tokenType === TOKEN_TYPES.ERC20) {
      return 'Add a ERC20 token';
    }
  }

  renderEmpty() {
    return (
      <View style={emptyStyle.container}>
        <Image source={sadFace} style={emptyStyle.image} />
        <Text style={emptyStyle.title}>Oh no!</Text>
        <Text style={emptyStyle.desc}>Tokens you are looking for is</Text>
        <Text style={emptyStyle.desc}>not available.</Text>
        <Button style={emptyStyle.button} title={this.renderAddTokenText()} onPress={this.handleAddToken} />
      </View>
    );
  }

  renderTokenList() {
    const { tokens } = this.props;
    const { selected, filteredTokens } = this.state;
    const tokenList = filteredTokens || tokens;
    const isEmpty = !(tokenList?.length > 0);

    return (
      <ScrollView>
        {this.renderTokenTypes()}
        {!isEmpty ? (
          <FlatList
            style={searchPTokenStyle.listToken}
            data={filteredTokens || tokens}
            extraData={selected}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
          />
        ) : this.renderEmpty()}
        {!isEmpty ? (
          <TouchableWithoutFeedback onPress={this.handleAddToken}>
            <View style={searchPTokenStyle.followBtn}>
              <Icon containerStyle={searchPTokenStyle.followBtnIcon} name="add-circle-outline" size={35} color={COLORS.primary} />
              <Text style={searchPTokenStyle.followBtnText}>{this.renderAddTokenText()}</Text>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={searchPTokenStyle.container}>
        {this.renderHeader()}
        {this.renderTokenList()}
      </View>
    );
  }
}

SearchToken.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.shape({
    tokenId: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    pSymbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  handleAddFollowToken: PropTypes.func.isRequired,
  handleAddToken: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SearchToken;
