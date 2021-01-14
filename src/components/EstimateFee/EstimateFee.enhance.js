/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { ExHandler } from '@src/services/exception';
import { useKeyboard } from '@src/components/UseEffect/useKeyboard';
import { actionFetchFee } from './EstimateFee.actions';

const enhance = (WrappedComp) => (props) => {
  const {
    amount,
    address,
    memo,
    isExternalAddress,
    isIncognitoAddress,
  } = props;
  const dispatch = useDispatch();
  const [isKeyboardVisible] = useKeyboard();
  const handleChangeForm = async (
    address,
    amount,
    memo,
    isExternalAddress,
    isIncognitoAddress,
    isKeyboardVisible,
  ) => {
    try {
      if (!amount || !address || isKeyboardVisible) {
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

  const _handleChangeForm = React.useRef(handleChangeForm);

  React.useEffect(() => {
    _handleChangeForm.current(
      address,
      amount,
      memo,
      isExternalAddress,
      isIncognitoAddress,
      isKeyboardVisible,
    );
  }, [
    address,
    amount,
    memo,
    isExternalAddress,
    isIncognitoAddress,
    isKeyboardVisible,
  ]);
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
