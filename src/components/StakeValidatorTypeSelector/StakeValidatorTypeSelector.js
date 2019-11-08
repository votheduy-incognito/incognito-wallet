import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memmoize from 'memoize-one';
import { View, Text, TouchableOpacity } from '@src/components/core';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@src/styles';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import styles from './styles';

class StakeValidatorTypeSelector extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { stakeTypeId, onChange } = this.props;

    if (stakeTypeId !== undefined && stakeTypeId !== null && typeof onChange === 'function') {
      const defaultStakeType = this.getTypeById(stakeTypeId);
      onChange(defaultStakeType);
    }
  }

  getTypeById = id => {
    const { stakeData } = this.props;
    return stakeData?.find(stakeType => stakeType?.id === id);
  }

  isValidId = memmoize((id, types) => {
    if (types?.map(t => t?.id).includes(id)) {
      return true;
    }

    return false;
  });

  handleSelect = type => {
    const { onChange, stakeData } = this.props;

    if (this.isValidId(type?.id, stakeData) && typeof onChange === 'function') {
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
          {formatUtil.amount(type?.amount, CONSTANT_COMMONS.DECIMALS[CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV])} {CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { style, account,isNotEnoughBalance } = this.props;
    const stakeShard = this.getTypeById(CONSTANT_COMMONS.STAKING_TYPES.SHARD);
    
    const enoughMsg = `Stake ${formatUtil.amount(stakeShard?.amount, CONSTANT_COMMONS.DECIMALS[CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV])} ${CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV} using ${account?.name ? `"${account?.name }"`: ''}?`;
    // const enoughMsg = `${account?.name ? `"${account?.name }"`: ''} successfully staked ${formatUtil.amount(stakeShard?.amount, CONSTANT_COMMONS.DECIMALS[CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV])} ${CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV}.`;
    // const notEnoughMsg = `Please make sure your account ${account?.name ? `"${account?.name }"`: ''} has enough ${formatUtil.amount(stakeShard?.amount, CONSTANT_COMMONS.DECIMALS[CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV])} ${CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV}`;
    // Please ensure that you have at least 1750 PRV in your account to stake.
    const notEnoughMsg = `Please ensure you have ${formatUtil.amount(stakeShard?.amount, CONSTANT_COMMONS.DECIMALS[CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV])} ${CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV} in your account ${account?.name ? `"${account?.name }"`: ''} to stake, and enough to cover the transaction fee (0.0001 PRV or less).`;
    return (
      <View style={[styles.container, style]}>
        {/* <Text style={styles.title}>What kind of validator?</Text>
        {
          stakeData?.map(type => this.renderItem(type, stakeTypeId === type.id))
        } */}
        <Text style={styles.title}>{isNotEnoughBalance?notEnoughMsg:enoughMsg}</Text>
      </View>
    );
  }
}

StakeValidatorTypeSelector.defaultProps = {
  stakeTypeId: null,
  onChange: null,
  style: null,
  account: null,
  isNotEnoughBalance:true
};

StakeValidatorTypeSelector.propTypes = {
  stakeTypeId: PropTypes.number,
  isNotEnoughBalance:PropTypes.bool,
  onChange: PropTypes.func,
  style: PropTypes.object,
  account: PropTypes.object,
  stakeData: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default StakeValidatorTypeSelector;
