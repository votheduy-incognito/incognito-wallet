import React from 'react';
import PropTypes from 'prop-types';
import { Button, View, Text, Image } from '@src/components/core';
import { tokenTypeStyle } from './styles';

const TokenType = ({ isSelected, type, onSelectType }) => (
  <Button
    style={[tokenTypeStyle.type, isSelected && tokenTypeStyle.selected]}
    onPress={() => onSelectType(type.value)}
  >
    <View>
      <Image source={isSelected ? type.active : type.inactive} style={tokenTypeStyle.image} />
      <Text style={[tokenTypeStyle.name, isSelected && tokenTypeStyle.selectedText]}>{type.name}</Text>
    </View>
  </Button>
);

TokenType.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  onSelectType: PropTypes.func.isRequired,
  type: PropTypes.shape({
    active: PropTypes.string.isRequired,
    inactive: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired
};

export default React.memo(TokenType);
