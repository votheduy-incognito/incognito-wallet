import {DEPOSIT_FLOW, WITHDRAW_FLOW} from '@screens/Stake/stake.constant';
import convert from '@utils/convert';
import {validator} from '@src/components/core/reduxForm';
import {noError} from '@src/components/Input/input.utils';
import {CONSTANT_COMMONS} from '@src/constants';
import format from '@src/utils/format';
import _ from 'lodash';

export const validatedAmount = ({value, min, max, pDecimals}) => {
  const required = validator.required()(value);
  const number = validator.number()(value);
  const minAmount = _.floor(convert.toHumanAmount(min, pDecimals), 4);
  const maxAmount = _.floor(convert.toHumanAmount(max, pDecimals), 4);
  const minValue = validator.minValue(minAmount)(value);
  const maxValue = validator.maxValue(maxAmount)(value);
  console.log('maxAmount', maxAmount);
  if (required) {
    return {
      error: true,
      message: required,
    };
  }
  if (number) {
    return {
      error: true,
      message: number,
    };
  }
  if (minValue) {
    return {
      error: true,
      message: minValue,
    };
  }
  if (maxValue) {
    return {
      error: true,
      message: maxValue,
    };
  }
  if (maxAmount === 0) {
    return {
      error: true,
      message: 'Your balance is not enough to send',
    };
  }
  return noError;
};

export const getHookFactories = ({account, activeFlow, balancePStake}) => {
  const {pDecimals, symbol} = CONSTANT_COMMONS.PRV;
  let hookAccount = {
    id: 0,
    leftText: '',
    rightText: account?.name || account?.AccountName,
    rightTextStyle: {
      maxWidth: '40%',
    },
  };
  let hookBalance = {
    id: 1,
    leftText: '',
    rightText: '',
  };
  switch (activeFlow) {
  case DEPOSIT_FLOW: {
    const balance = format.balance(account?.value || 0, pDecimals, 4);
    hookBalance.leftText = 'Balance:';
    hookBalance.rightText = `${balance} ${symbol}`;
    hookAccount.leftText = 'Deposit from:';
    break;
  }
  case WITHDRAW_FLOW: {
    const balance = format.balance(balancePStake, pDecimals, 4);
    hookBalance.leftText = 'pStake balance:';
    hookBalance.rightText = `${balance} ${symbol}`;
    hookAccount.leftText = 'Withdraw to:';
    break;
  }
  default:
    break;
  }
  return [hookAccount, hookBalance];
};
