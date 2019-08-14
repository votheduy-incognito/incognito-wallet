import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, TextInput, Button } from  '@src/components/core';
import TokenItem from './TokenItem';
import { searchPTokenStyle } from './styles';

class SearchToken extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: (new Map(): Map<string, boolean>),
      filteredTokens: null,
    };
  }

  _handleSelect = (tokenId: string) => {
    this.setState(state => {
      // copy the map rather than modifying state
      const selected = new Map(state.selected);
      selected.set(tokenId, !selected.get(tokenId)); // toggle
      return { selected };
    });
  }

  _renderItem = ({ item, index }) => {
    const { tokens } = this.props;
    const { selected, filteredTokens } = this.state;
    const length = (filteredTokens || tokens)?.length;
    return (
      <TokenItem
        onPress={this._handleSelect}
        token={item}
        selected={selected.get(item.tokenId)}
        divider={index < (length - 1)}
      />
    );
  }

  _keyExtractor = item => item.tokenId;

  handleFilter = term => {
    const { tokens } = this.props;
    const filteredTokens = tokens.filter(t => {
      const lowerCaseTerm = term ?  String(term).toLowerCase() : term;
      const lowerCaseTokenName = [t.name, t.symbol].join(' ')?.toLowerCase();
      return lowerCaseTokenName.includes(lowerCaseTerm || '');
    });
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
  }

  render() {
    const { tokens } = this.props;
    const { selected, filteredTokens } = this.state;

    return (
      <View style={searchPTokenStyle.container}>
        <TextInput
          label='Search by symbol'
          placeholder='ETH, BTC,...'
          style={searchPTokenStyle.searchInput}
          onChangeText={this.handleFilter}
        />
        <FlatList
          style={searchPTokenStyle.listToken}
          data={filteredTokens || tokens}
          extraData={selected}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
        <Button title='Follow' onPress={this.handleSaveFollow} style={searchPTokenStyle.followBtn} />
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
  handleAddFollowToken: PropTypes.func.isRequired
};

export default SearchToken;