import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

function PlayerToken(props) {
  const { cells, playerToken, onSelect } = props;
  const token = {
    ...playerToken.token,
    number: Math.min(playerToken.number, playerToken.actualNumber),
    cell: cells.find(item => item.token?.id === playerToken.tokenId),
  };

  return (
    <TouchableOpacity
      style={styles.token}
      onPress={() => onSelect(playerToken)}
    >
      <View>
        <Text style={styles.tokenName}>{token.cell.name}</Text>
        <Text style={styles.tokenSymbol}>{token.symbol}</Text>
      </View>
      <View>
        <Text style={styles.tokenNumber}>{token.number}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  token: {
    margin: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tokenName: {
    color: '#101111',
    fontSize: 16,
  },
  tokenSymbol: {
    color: '#9AB7B8',
    fontSize: 14,
  },
  tokenNumber: {
    fontSize: 16,
    color: '#101111',
  },
});

PlayerToken.propTypes = {
  onSelect: PropTypes.func.isRequired,
  cells: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number,
    token: PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.number,
      symbol: PropTypes.string,
    })
  })).isRequired,
  playerToken: PropTypes.shape({
    tokenId: PropTypes.string,
    number: PropTypes.number,
    actualNumber: PropTypes.number,
    token: PropTypes.shape({}),
  }).isRequired,
};

export default React.memo(PlayerToken);
