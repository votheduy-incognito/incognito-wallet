import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import accountService from '@services/wallet/accountService';
import { PRV } from '@services/wallet/tokenService';
import convert from '@utils/convert';
import formatUtil from '@utils/format';
import { walletSelector } from '@src/redux/selectors/wallet';
import { accountSeleclor } from '@src/redux/selectors';
import { compose } from 'recompose';
import withInput from '@screens/DexV2/features/Form/Form.enhanceInput';
import { tradeSelector } from './Trade.selector';
import {
  actionSetInputBalance,
  actionSetLastAccount,
  actionSetLastInputToken,
  actionSetPRVBalance,
} from './Trade.actions';

const enhance = (WrappedComp) => (props) => {
  const wallet = useSelector(walletSelector);
  const account = useSelector(accountSeleclor.defaultAccountSelector);
  const dispatch = useDispatch();
  const {
    inputToken,
    inputFee,
    lastAccount,
    lastInputToken,
    feeToken,
    pairTokens,
  } = useSelector(tradeSelector);
  const setPRVBalance = (payload) => dispatch(actionSetPRVBalance(payload));
  const setInputBalance = (payload) => dispatch(actionSetInputBalance(payload));
  const setLastAccount = (payload) => dispatch(actionSetLastAccount(payload));
  const setLastInputToken = (payload) =>
    dispatch(actionSetLastInputToken(payload));
  const { onChangeField } = props;
  const onChangeInputText = (value) => onChangeField(value, 'input');
  const loadBalance = async (tokenChange = false) => {
    try {
      if (!inputToken) {
        return;
      }
      const token = inputToken;
      const balance = await accountService.getBalance(
        account,
        wallet,
        token.id,
      );
      if (token !== PRV) {
        const prvBalance = await accountService.getBalance(account, wallet);
        setPRVBalance(prvBalance);
      } else {
        setPRVBalance(balance);
      }
      if (tokenChange) {
        if (!balance && balance <= inputFee) {
          onChangeInputText('');
        } else {
          let humanAmount = convert.toHumanAmount(
            balance,
            inputToken.pDecimals,
          );
          //load balance -> balance > 1 => input: 1 nguoc lai la max
          if (humanAmount < 1) {
            humanAmount = formatUtil.toFixed(humanAmount, inputToken.pDecimals);
            onChangeInputText(humanAmount.toString());
          } else {
            onChangeInputText('1');
          }
        }
      }
      const payload = {
        inputBalance: balance,
        inputBalanceText: formatUtil.amountFull(balance, token?.pDecimals),
      };
      setInputBalance(payload);
    } catch (error) {
      console.debug('GET INPUT BALANCE ERROR', error);
    }
  };

  React.useEffect(() => {
    setInputBalance();
    if (feeToken) {
      loadBalance(lastInputToken !== inputToken || lastAccount !== account);
      setLastInputToken(inputToken);
      setLastAccount(account);
    }
  }, [account, feeToken, pairTokens, inputToken]);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default compose(
  withInput,
  enhance,
);
