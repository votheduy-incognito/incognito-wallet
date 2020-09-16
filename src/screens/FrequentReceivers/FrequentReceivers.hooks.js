import React from 'react';
import { ButtonBasic } from '@src/components/Button';
import { StyleSheet } from 'react-native';
import { ExHandler } from '@src/services/exception';
import PropTypes from 'prop-types';
import { FONT } from '@src/styles';
import { listAccountSelector } from '@src/redux/selectors/account';
import { useSelector } from 'react-redux';
import { CONSTANT_KEYS } from '@src/constants';

const styleSheet = StyleSheet.create({
  btnSaveReceivers: {
    marginTop: 50,
    width: '100%',
  },
  titleReceivers: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
  },
});

export const useBtnSaveReceiver = (props) => {
  const { onSaveReceivers, receivers, toAddress, keySave } = props;
  const accounts = useSelector(listAccountSelector);
  const [btnSave, setBtnSave] = React.useState(null);
  const isExisted =
    receivers.some((item) => item?.address === toAddress) ||
    (keySave === CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK &&
      accounts?.some((account) => account?.paymentAddress === toAddress));
  React.useEffect(() => {
    renderBtnSaveReceiver();
    return () => {
      renderBtnSaveReceiver();
    };
  }, []);
  const renderBtnSaveReceiver = async () => {
    try {
      if (!isExisted) {
        await setBtnSave(
          <ButtonBasic
            btnStyle={styleSheet.btnSaveReceivers}
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
  keySave: PropTypes.string.isRequired,
};
