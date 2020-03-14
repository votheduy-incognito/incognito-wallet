import React from 'react';
import {Button} from '@src/components/core';
import {StyleSheet} from 'react-native';
import {ExHandler} from '@src/services/exception';
import PropTypes from 'prop-types';
import {isFieldExist} from './FrequentReceivers.utils';

const styleSheet = StyleSheet.create({
  btnSaveReceivers: {
    backgroundColor: '#F3F5F5',
    marginTop: 20,
    width: '100%',
  },
  titleReceivers: {
    color: '#000',
  },
});

export const useBtnSaveReceiver = props => {
  const {onSaveReceivers, receivers, toAddress} = props;
  const [btnSave, setBtnSave] = React.useState(null);
  React.useEffect(() => {
    renderBtnSaveReceiver();
    return () => {
      renderBtnSaveReceiver();
    };
  }, []);
  const renderBtnSaveReceiver = async () => {
    try {
      const isAddrExist = (
        await isFieldExist('address', toAddress, '', receivers)
      ).error;
      if (!isAddrExist) {
        await setBtnSave(
          <Button
            style={styleSheet.btnSaveReceivers}
            title="Save this address"
            onPress={onSaveReceivers}
            titleStyle={styleSheet.titleReceivers}
          />,
        );
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  return [btnSave];
};

useBtnSaveReceiver.propTypes = {
  onSaveReceivers: PropTypes.func.isRequired,
  toAddress: PropTypes.string.isRequired,
  receivers: PropTypes.array.isRequired,
};
