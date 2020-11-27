import React from 'react';
import { ButtonBasic } from '@src/components/Button';
import { StyleSheet } from 'react-native';
import { ExHandler } from '@src/services/exception';
import PropTypes from 'prop-types';
import { FONT } from '@src/styles';
import { useSelector } from 'react-redux';
import { CONSTANT_KEYS } from '@src/constants';
import { listAllMasterKeyAccounts } from '@src/redux/selectors/masterKey';
import accountService from '@services/wallet/accountService';

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
  const accounts = useSelector(listAllMasterKeyAccounts);
  const [btnSave, setBtnSave] = React.useState(null);
  const isExisted =
    receivers.some((item) => item?.address === toAddress) ||
    (keySave === CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK &&
      accounts?.some((account) => accountService.getPaymentAddress(account) === toAddress));
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
