import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FlatList, Image, View, ScrollView, Text, TouchableOpacity, Toast, Container } from '@src/components/core';
import { TextInput } from 'react-native';
import BackButton from '@src/components/BackButton';
import Icons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '@src/styles';
import sadFace from '@src/assets/images/sad_face.png';
import addIcon from '@src/assets/images/icons/add_outline.png';
import { ExHandler } from '@src/services/exception';
import { debounce, remove } from 'lodash';
import routeNames from '@src/router/routeNames';
import TokenInfo, { showTokenInfo } from '@src/components/HeaderRight/TokenInfo';
import { searchPTokenStyle, emptyStyle } from './styles';
import TokenItem from './TokenItem';

class SearchToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      processingTokens: [],
      filteredTokenIds: null,
    };

    this.filter = debounce(this.filter.bind(this), 500);
  }

  componentDidMount() {
    this.filter();
  }

  handleFollowToken = async (tokenId) => {
    try {
      const { handleAddFollowToken } = this.props;
      const { selected } = this.state;

      if (selected.includes(tokenId)) {
        Toast.showInfo('This coin is already in your following list');
      }

      this.setState(({ processingTokens }) => ({
        processingTokens: [
          ...processingTokens,
          tokenId,
        ],
      }));

      // adding to following list
      await handleAddFollowToken(tokenId);
    } catch (e) {
      new ExHandler(e, 'Sorry, can not add this coin to your list. Please try again.').showErrorToast();
    } finally {
      this.setState(({ processingTokens }) => {
        const newList = remove(processingTokens, id => id === tokenId);
        return newList && { processingTokens: [...processingTokens] };
      });
    }
  }

  handleUnFollowToken = async (tokenId) => {
    try {
      const { handleRemoveFollowToken } = this.props;

      this.setState(({ processingTokens }) => ({
        processingTokens: [
          ...processingTokens,
          tokenId,
        ],
      }));

      // adding to following list
      await handleRemoveFollowToken(tokenId);
    } catch (e) {
      new ExHandler(e, 'Sorry, can not remove this coin from your list. Please try again.').showErrorToast();
    } finally {
      this.setState(({ processingTokens }) => {
        const newList = remove(processingTokens, id => id === tokenId);
        return newList && { processingTokens: [...processingTokens] };
      });
    }
  }

  _renderItem = ({ item }) => {
    const { processingTokens } = this.state;
    return (
      <TokenItem
        onFollowToken={this.handleFollowToken}
        onUnFollowToken={this.handleUnFollowToken}
        token={item}
        isProcessing={processingTokens.includes(item.tokenId)}
        onPress={showTokenInfo}
        divider
      />
    );
  };

  _keyExtractor = item => item.tokenId;

  filter() {
    try {
      const { tokens } = this.props;
      const { query } = this.state;

      const filteredTokenIds = tokens
        .filter(t => {
          const lowerCaseTerm = query ? String(query).toLowerCase() : query;
          const lowerCaseTokenName = [t.name, t.symbol, t.networkName, t.pSymbol].join(' ')?.toLowerCase();
          return lowerCaseTokenName.includes(lowerCaseTerm || '');
        }).map(t => t.tokenId);
      this.setState({ filteredTokenIds });
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  }

  handleSearch = (query) => {
    this.setState({ query }, this.filter);
  };

  handleClear = () => {
    this.setState({ query: null }, this.filter);
  };

  hanldeAddTokenManually = () => {
    const { navigation } = this.props;
    navigation?.navigate(routeNames.AddToken);
  };

  renderHeader() {
    const { query } = this.state;
    return (
      <View style={searchPTokenStyle.header}>
        <BackButton />
        <Icons name="ios-search" style={searchPTokenStyle.inputIcon} color='white' size={24} />
        <TextInput
          placeholder='Search for a privacy coin'
          placeholderTextColor={COLORS.white}
          style={searchPTokenStyle.searchInput}
          selectionColor={COLORS.white}
          value={query}
          onChangeText={this.handleSearch}
        />
        {
          query ? (
            <TouchableOpacity
              onPress={this.handleClear}
              style={searchPTokenStyle.cancelBtn}
            >
              <Text style={searchPTokenStyle.cancelBtnText}>Clear</Text>
            </TouchableOpacity>
          ) : null
        }
      </View>
    );
  }

  renderEmpty() {
    return (
      <View style={emptyStyle.container}>
        <Image source={sadFace} style={emptyStyle.image} />
        <Text style={emptyStyle.title}>Oh no!</Text>
        <Text style={emptyStyle.desc}>Tokens you are looking for is</Text>
        <Text style={emptyStyle.desc}>not available.</Text>
        <Button style={emptyStyle.button} title='Issue your own privacy coin' onPress={this.hanldeAddTokenManually} />
      </View>
    );
  }

  getTokenList = (ids) => {
    const { tokens } = this.props;
    return ids.map(id => tokens.find(token => token.tokenId === id));
  }

  renderTokenList() {
    const { tokens } = this.props;
    const { filteredTokenIds, processingTokens } = this.state;
    const tokenList = filteredTokenIds && this.getTokenList(filteredTokenIds) || tokens;
    const isEmpty = !(tokenList?.length > 0);

    if (isEmpty) {
      return (
        <Container>
          {this.renderEmpty()}
        </Container>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <FlatList
              style={searchPTokenStyle.listToken}
              data={tokenList}
              extraData={processingTokens}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
          </ScrollView>
        </View>

        <TouchableOpacity style={{ height: 60}} onPress={this.hanldeAddTokenManually}>
          <View style={searchPTokenStyle.followBtn}>
            <Image source={addIcon} style={searchPTokenStyle.followBtnIcon} />
            <Text style={searchPTokenStyle.followBtnText}>Issue your own privacy coin</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={searchPTokenStyle.container}>
        {this.renderHeader()}
        {this.renderTokenList()}
        <TokenInfo />
      </View>
    );
  }
}

SearchToken.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.shape({
    tokenId: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  handleAddFollowToken: PropTypes.func.isRequired,
  handleRemoveFollowToken: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default SearchToken;
