/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ExHandler } from '@src/services/exception';
import { debounce } from 'lodash';
import { actionFetchFee } from './EstimateFee.actions';
import { feeDataSelector } from './EstimateFee.selector';

const enhance = (WrappedComp) => (props) => {
  const { screen, isFetching } = useSelector(feeDataSelector);
  const {
    amount,
    address,
    memo,
    isExternalAddress,
    isIncognitoAddress,
  } = props;
  const dispatch = useDispatch();
  const handleChangeForm = async (
    address,
    amount,
    screen,
    memo,
    isFetching,
    isExternalAddress,
    isIncognitoAddress,
  ) => {
    try {
      if (!amount || !address || isFetching) {
        return;
      }
      let screen = 'Send';
      if (isExternalAddress) {
        screen = 'UnShield';
      } else if (isIncognitoAddress) {
        screen = 'Send';
      }
      await dispatch(
        actionFetchFee({
          amount,
          address,
          screen,
          memo,
        }),
      );
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const _handleChangeForm = React.useRef(debounce(handleChangeForm, 400));

  React.useEffect(() => {
    _handleChangeForm.current(
      address,
      amount,
      screen,
      memo,
      isFetching,
      isExternalAddress,
      isIncognitoAddress,
    );
  }, [address, amount, screen, memo, isExternalAddress, isIncognitoAddress]);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props }} />
    </ErrorBoundary>
  );
};

enhance.defaultProps = {
  memo: '',
};

enhance.propTypes = {
  amount: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  memo: PropTypes.string,
  isExternalAddress: PropTypes.bool.isRequired,
  isIncognitoAddress: PropTypes.bool.isRequired,
};

export default enhance;
