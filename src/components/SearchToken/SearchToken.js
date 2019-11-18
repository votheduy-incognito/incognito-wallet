import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, FlatList, Image, View, ScrollView, Text, TouchableOpacity, Toast } from '@src/components/core';
import { TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import {COLORS} from '@src/styles';
import sadFace from '@src/assets/images/sad_face.png';
import addIcon from '@src/assets/images/icons/add_outline.png';
import { ExHandler } from '@src/services/exception';
import { debounce, remove } from 'lodash';
import { searchPTokenStyle, emptyStyle } from './styles';
import TokenItem from './TokenItem';


class SearchToken extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      processingTokens: [],
      filteredTokens: null,
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
        Toast.showInfo('This token is already in your following list');
      }

      this.setState(({ processingTokens }) => ({
        processingTokens: [
          ...processingTokens,
          tokenId,
        ],
      }));

      // adding to following list
      await handleAddFollowToken(tokenId);

      // then marking this token
      this.setState(({ selected }) => ({
        selected: [...selected, tokenId]
      }));
    } catch (e) {
      new ExHandler(e, 'Sorry, can not add this token to your list. Please try again.').showErrorToast();
    } finally {
      this.setState(({ processingTokens }) => {
        const newList = remove(processingTokens, id => id === tokenId);
        return newList && { processingTokens: [...processingTokens] };
      });
    }
  }

  _renderItem = ({ item }) => {
    const { selected, processingTokens } = this.state;
    return (
      <TokenItem
        onPress={this.handleFollowToken}
        token={item}
        selected={selected.includes(item.tokenId)}
        isProcessing={processingTokens.includes(item.tokenId)}
        divider
      />
    );
  };

  _keyExtractor = item => item.tokenId;

  filter() {
    try {
      const { tokens } = this.props;
      const { query } = this.state;
      const filteredTokens = tokens
        .filter(t => {
          const lowerCaseTerm = query ? String(query).toLowerCase() : query;
          const lowerCaseTokenName = [t.name, t.symbol, t.networkName].join(' ')?.toLowerCase();
          return lowerCaseTokenName.includes(lowerCaseTerm || '');
        });
      this.setState({ filteredTokens });
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  }

  handleSearch = (query) => {
    this.setState({ query }, this.filter);
  };

  renderHeader() {
    const { selected } = this.state;
    const { onCancel } = this.props;
    const isSelected = selected?.length > 0;
    return (
      <View style={searchPTokenStyle.header}>
        <Icon name="search" containerStyle={searchPTokenStyle.inputIcon} color='white' size={32} />
        <TextInput
          placeholder='Search for a token'
          placeholderTextColor={COLORS.white}
          style={searchPTokenStyle.searchInput}
          selectionColor={COLORS.white}
          onChangeText={this.handleSearch}
        />
        <TouchableOpacity
          onPress={onCancel}
          style={searchPTokenStyle.cancelBtn}
        >
          <Text style={searchPTokenStyle.cancelBtnText}>{isSelected ? 'Done' : 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderAddTokenText() {
    return 'AAADDDDD';
  }

  renderEmpty() {
    return (
      <View style={emptyStyle.container}>
        <Image source={sadFace} style={emptyStyle.image} />
        <Text style={emptyStyle.title}>Oh no!</Text>
        <Text style={emptyStyle.desc}>Tokens you are looking for is</Text>
        <Text style={emptyStyle.desc}>not available.</Text>
        <Button style={emptyStyle.button} title={this.renderAddTokenText()} onPress={() => alert(1)} />
      </View>
    );
  }

  renderTokenList() {
    const { tokens } = this.props;
    const { selected, filteredTokens, processingTokens } = this.state;
    const tokenList = filteredTokens || tokens;
    const isEmpty = !(tokenList?.length > 0);

    return (
      <ScrollView>
        {!isEmpty ? (
          <FlatList
            style={searchPTokenStyle.listToken}
            data={filteredTokens || tokens}
            extraData={{ selected, processingTokens}}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
          />
        ) : this.renderEmpty()}
        {!isEmpty ? (
          <TouchableOpacity onPress={() => alert(2)}>
            <View style={searchPTokenStyle.followBtn}>
              <Image source={addIcon} style={searchPTokenStyle.followBtnIcon} />
              <Text style={searchPTokenStyle.followBtnText}>{this.renderAddTokenText()}</Text>
            </View>
          </TouchableOpacity>
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
  onCancel: PropTypes.func.isRequired,
};

export default SearchToken;
