import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useSelector, useDispatch} from 'react-redux';
import {
  actionFetchCreateStake,
  actionFetchCreateUnStake,
  actionFetchFee,
} from '@screens/Stake/stake.actions';
import {
  activeFlowSelector,
  stakeDataSelector,
  feeStakeSelector,
  loadingSubmitAmountSelector,
} from '@screens/Stake/stake.selector';
import {ExHandler} from '@src/services/exception';
import format from '@src/utils/format';
import {DEPOSIT_FLOW, WITHDRAW_FLOW} from '@screens/Stake/stake.constant';
import {validatedAmount, getHookFactories} from './TypeAmount.utils';

const enhance = WrappedComp => props => {
  const [state, setState] = React.useState({
    amount: {
      value: 0,
      validated: {
        error: false,
        message: '',
      },
    },
  });
  const {amount} = state;
  const fee = useSelector(feeStakeSelector);
  const loading = useSelector(loadingSubmitAmountSelector);
  const validAmount = !amount.validated.error && amount.value !== 0;
  const shouldDisabled = !validAmount || loading;
  const {btnSubmitAmount, activeFlow, account} = useSelector(
    activeFlowSelector,
  );
  const {
    minToStake,
    maxToStake,
    minToWithdraw,
    pDecimals,
    balance: balancePStake,
  } = useSelector(stakeDataSelector);
  const dispatch = useDispatch();
  const feeData = {
    leftText: 'Fee:',
    rightText: format.amountFull(fee.value, pDecimals),
    disabled: activeFlow !== DEPOSIT_FLOW,
  };
  const onSubmitAmount = async () => {
    try {
      if (shouldDisabled || fee.isFetching) {
        return;
      }
      switch (activeFlow) {
      case DEPOSIT_FLOW: {
        await dispatch(
          actionFetchCreateStake({
            amount: amount.value,
            fee: fee.value,
          }),
        );
        break;
      }
      case WITHDRAW_FLOW: {
        await dispatch(
          actionFetchCreateUnStake({
            amount: amount.value,
          }),
        );
        break;
      }
      default:
        break;
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const onValidateAmount = value =>
    validatedAmount({
      value,
      activeFlow,
      minToStake,
      minToWithdraw,
      maxToStake,
      balancePStake,
    });
  const handleOnChangeAmount = async value =>
    await setState({
      ...state,
      amount: {
        ...amount,
        value,
        validated: onValidateAmount(value),
      },
    });

  const handleCalcFee = async () => {
    try {
      const shouldFetchFee =
        validAmount && activeFlow === DEPOSIT_FLOW && !fee.isFetched;
      if (shouldFetchFee) {
        await dispatch(actionFetchFee());
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  React.useEffect(() => {
    switch (activeFlow) {
    case DEPOSIT_FLOW: {
      handleCalcFee();
      return;
    }
    default:
      return;
    }
  }, [amount.value, activeFlow]);
  React.useEffect(() => {
    setState({
      ...state,
      amount: {
        ...amount,
        validated: onValidateAmount(amount.value),
      },
    });
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          hookFactories: getHookFactories({
            account,
            activeFlow,
            balancePStake,
          }),
          handleOnChangeAmount,
          amount,
          btnSubmitAmount,
          onSubmitAmount,
          shouldDisabled,
          fee,
          feeData,
          loading,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
