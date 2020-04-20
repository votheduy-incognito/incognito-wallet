import {DEPOSIT_FLOW, WITHDRAW_FLOW} from '@screens/Stake/stake.constant';
import convert from '@utils/convert';
import {validator} from '@src/components/core/reduxForm';
import {noError} from '@src/components/Input/input.utils';
import {CONSTANT_COMMONS} from '@src/constants';
import format from '@src/utils/format';
import _ from 'lodash';
import React from 'react';

export const validatedAmount = ({value, min, max, pDecimals}) => {
  const required = validator.required()(value);
  const number = validator.number()(value);
  const minAmount = _.floor(convert.toHumanAmount(min, pDecimals), 9);
  const maxAmount = _.floor(convert.toHumanAmount(max, pDecimals), 9);
  const minValue = validator.minValue(minAmount)(value);
  const maxValue = validator.maxValue(maxAmount)(value);
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
  if (maxAmount === 0) {
    return {
      error: true,
      message: 'Your balance is not enough to send',
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
    const balance = format.amount(_.floor(account?.value || 0, 0), pDecimals);
    hookBalance.leftText = 'Balance:';
    hookBalance.rightText = `${balance} ${symbol}`;
    hookAccount.leftText = 'Deposit from:';
    break;
  }
  case WITHDRAW_FLOW: {
    const balance = format.amount(_.floor(balancePStake, 0), pDecimals);
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

export const useDebounce = (text, delay) => {
  delay = delay || 500;
  const [debounced, setDebounced] = React.useState(text);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(text);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [text, delay]);

  return debounced;
};


