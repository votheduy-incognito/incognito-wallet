import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, TextInput, Button } from  '@src/components/core';
import PTokenItem from './PTokenItem';
import { searchPTokenStyle } from './styles';

class SearchPToken extends PureComponent {
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

  _renderItem = ({ item }) => {
    const { selected } = this.state;
    return (
      <PTokenItem
        onPress={this._handleSelect}
        token={item}
        selected={selected.get(item.tokenId)}
      />
    );
  }

  _keyExtractor = item => item.tokenId;

  handleFilter = term => {
    const { tokens } = this.props;
    const filteredTokens = tokens.filter(t => [t.name, t.pSymbol, t.symbol].join(' ').includes(term || ''));
    this.setState({ filteredTokens });
  }

  handleSaveFollow = () => {
    const { handleAddFollowToken } = this.props;
    const { selected } = this.state;
    const tokenIds = [];

    selected.forEach((isSelected, tokenId) => isSelected && tokenIds.push(tokenId));
    
    handleAddFollowToken(tokenIds);

    this.setState({ selected: new Map() });
  }

  render() {
    const { tokens } = this.props;
    const { selected, filteredTokens } = this.state;

    return (
      <View>
        <TextInput
          onChangeText={this.handleFilter}
        />
        <FlatList
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

SearchPToken.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.shape({
    tokenId: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    pSymbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  handleAddFollowToken: PropTypes.func.isRequired
};

export default SearchPToken;