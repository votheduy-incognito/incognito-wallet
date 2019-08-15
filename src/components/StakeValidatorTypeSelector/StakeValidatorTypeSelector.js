import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memmoize from 'memoize-one';
import { View, Text, TouchableOpacity } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@src/styles';
import styles from './styles';

const TYPES = [
  {
    id: CONSTANT_COMMONS.STAKING_TYPES.SHARD,
    name: 'Shard validator',
    amount: 1750
  },
  {
    id: CONSTANT_COMMONS.STAKING_TYPES.BEACON,
    name: 'Beacon validator',
    amount: 5250
  }
];

class StakeValidatorTypeSelector extends Component {
  constructor(props) {
    super(props);
  }

  isValidId = memmoize((id) => {
    if (TYPES.map(t => t?.id).includes(id)) {
      return true;
    }

    return false;
  });

  handleSelect = type => {
    const { onChange } = this.props;

    if (this.isValidId(type?.id) && typeof onChange === 'function') {
      onChange(type);
    }
  }

  renderItem = (type, isSelected) => {
    const onPress = () => this.handleSelect(type);

    return (
      <TouchableOpacity
        key={type?.id}
        onPress={onPress}
        style={[
          styles.itemContainer,
        ]}
      >
        <View style={styles.group}>
          <Icons 
            size={25}
            name={isSelected ? 'checkbox-marked-circle' : 'circle-outline'}
            color={isSelected ? COLORS.primary : COLORS.lightGrey1}
            style={styles.icon}
          />
          <Text
            style={[
              styles.text,
              isSelected && styles.activeText,
            ]}
          >
            {type?.name}
          </Text>
        </View>
        <Text
          style={[
            styles.text,
            isSelected && styles.activeText,
          ]}
        >
          {type?.amount} {CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { selectedId } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>What kind of validator?</Text>
        {
          TYPES.map(type => this.renderItem(type, selectedId === type.id))
        }
      </View>
    );
  }
}

StakeValidatorTypeSelector.defaultProps = {
  selectedId: null,
  onChange: null
};

StakeValidatorTypeSelector.propTypes = {
  selectedId: PropTypes.number,
  onChange: PropTypes.func
};

export default StakeValidatorTypeSelector;
