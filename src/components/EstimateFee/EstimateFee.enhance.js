/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import accountService from '@src/services/wallet/accountService';
import { ExHandler } from '@src/services/exception';
import { debounce } from 'lodash';
import { actionFetchFee } from './EstimateFee.actions';
import { feeDataSelector } from './EstimateFee.selector';

const enhance = (WrappedComp) => (props) => {
  const { screen, isFetching } = useSelector(feeDataSelector);
  const { amount = 0, address = '', memo = '' } = props;
  const isIncognitoAddress = accountService.checkPaymentAddress(address);
  const dispatch = useDispatch();
  const handleChangeForm = async () => {
    try {
      if (!amount || !address || isFetching) {
        return;
      }
      await dispatch(
        actionFetchFee({
          amount,
          address,
          screen: !isIncognitoAddress ? 'UnShield' : 'Send',
          memo,
        }),
      );
    } catch (error) {
      console.debug(error);
      new ExHandler(error).showErrorToast();
    }
  };
  const _handleChangeForm = debounce(handleChangeForm, 500);
  React.useEffect(() => {
    _handleChangeForm();
  }, [address, amount, screen, memo]);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props }} />
    </ErrorBoundary>
  );
};

enhance.propTypes = {
  amount: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
};

export default enhance;
