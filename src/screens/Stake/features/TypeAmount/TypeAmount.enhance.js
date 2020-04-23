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
import {getDecimalSeparator} from '@src/resources/separator';
import {
  actionToggleModal,
  actionToggleLoadingModal,
} from '@src/components/Modal';
import LoadingModal from '@src/components/Modal/features/LoadingModal';
import {
  validatedAmount,
  getHookFactories,
  useDebounce,
} from './TypeAmount.utils';

const enhance = WrappedComp => props => {
  const [state, setState] = React.useState({
    amount: {
      value: 0,
      validated: {
        error: false,
        message: '',
      },
    },
    error: null,
  });
  const {amount, error} = state;
  const fee = useSelector(feeStakeSelector);
  const loading = useSelector(loadingSubmitAmountSelector);
  const validAmount = !amount.validated.error && amount.value !== 0;
  const {
    btnSubmitAmount,
    activeFlow,
    account,
    min,
    max,
    maxTypeAmount,
  } = useSelector(activeFlowSelector);
  const debouncedVal = useDebounce(amount.value);
  const {pDecimals, balancePStake} = useSelector(stakeDataSelector);
  const dispatch = useDispatch();
  const feeData = {
    leftText: 'Fee:',
    rightText: format.amountFull(fee.value, pDecimals),
    disabled: activeFlow !== DEPOSIT_FLOW,
  };
  const handleShouldDisabled = () => {
    switch (activeFlow) {
    case DEPOSIT_FLOW: {
      return (
        !validAmount ||
          loading ||
          !!error ||
          fee.value === 0 ||
          !fee.isFetched
      );
    }
    case WITHDRAW_FLOW: {
      return !validAmount || loading || !!error;
    }
    default:
      return false;
    }
  };
  const shouldDisabled = handleShouldDisabled();
  const onSubmitAmount = async () => {
    try {
      if (shouldDisabled) {
        return;
      }
      await dispatch(
        actionToggleLoadingModal({
          toggle: true,
          title:
            'Please wait, this may take a couple of minutes.\nPlease do not navigate away from the screen.',
        }),
      );
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
      await dispatch(actionToggleLoadingModal());
      await setState({
        ...state,
        error: new ExHandler(error).getMessageError(),
      });
    }
  };
  const onValidateAmount = value =>
    validatedAmount({
      value,
      min,
      max,
      pDecimals,
    });
  const handleOnChangeAmount = async value => {
    await setState({
      ...state,
      amount: {
        ...amount,
        value,
        validated: onValidateAmount(value),
      },
      error: null,
    });
  };
  const handleCalcFee = async () => {
    try {
      const shouldFetchFee = validAmount && !fee.isFetched;
      if (shouldFetchFee) {
        await dispatch(actionFetchFee());
      }
    } catch (error) {
      await setState({
        ...state,
        error: 'Oops, something went wrong. Please try a different amount.',
        // new ExHandler(error).getMessageError(),
      });
    }
  };
  const handleShowMax = async () =>
    await setState({
      ...state,
      amount: {
        ...amount,
        value: String(maxTypeAmount).replace('.', getDecimalSeparator()),
        validated: onValidateAmount(maxTypeAmount),
      },
      error: null,
    });
  React.useEffect(() => {
    if (debouncedVal && activeFlow === DEPOSIT_FLOW) {
      handleCalcFee();
    }
  }, [debouncedVal]);
  React.useEffect(() => {
    setState({
      ...state,
      amount: {
        ...amount,
        validated: onValidateAmount(amount.value),
      },
    });
  }, [fee.value]);
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
          error,
          handleShowMax,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
