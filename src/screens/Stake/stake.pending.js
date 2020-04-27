import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {v4} from 'uuid';
import {COLORS, FONT} from '@src/styles';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {CONSTANT_COMMONS} from '@src/constants';
import format from '@src/utils/format';
import {stakeDataSelector} from './stake.selector';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
    marginTop: 10,
  },
  item: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    maxWidth: '50%',
  },
  break: {
    height: '80%',
    width: 2,
    backgroundColor: COLORS.lightGrey4,
    marginHorizontal: 10,
  },
});

const StakePendingItem = props => {
  const {operator, color, amount} = props;
  if (amount === 0) {
    return null;
  }
  return (
    <Text
      style={[
        styled.item,
        {
          color,
        },
      ]}
      numberOfLines={1}
    >
      {`${operator}${format.amount(amount, CONSTANT_COMMONS.PRV.pDecimals)} ${
        CONSTANT_COMMONS.PRV.symbol
      }`}
    </Text>
  );
};

const StakingPending = () => {
  const {pendingBalance, unstakePendingBalance, showAllPending} = useSelector(
    stakeDataSelector,
  );
  const pendingFactories = [
    {
      id: v4(),
      operator: '-',
      color: COLORS.red,
      amount: unstakePendingBalance,
    },
    {
      id: v4(),
      operator: '+',
      color: COLORS.primary,
      amount: pendingBalance,
    },
  ];
  return (
    <View style={styled.container}>
      <StakePendingItem {...pendingFactories[0]} />
      {showAllPending && <View style={styled.break} />}
      <StakePendingItem {...pendingFactories[1]} />
    </View>
  );
};

StakePendingItem.propTypes = {
  color: PropTypes.string.isRequired,
  operator: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
};

StakingPending.propTypes = {};

export default StakingPending;
