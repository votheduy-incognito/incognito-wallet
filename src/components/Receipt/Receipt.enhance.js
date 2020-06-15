import React from 'react';
import PropTypes from 'prop-types';
import formatUtil from '@src/utils/format';
import { CONSTANT_COMMONS, CONSTANT_CONFIGS } from '@src/constants';
import { useDispatch } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useBtnSaveAddressBook } from '@screens/AddressBook';
import { compose } from 'redux';
import { withLayout_2 } from '@src/components/Layout';
import { actionInitEstimateFee } from '@src/components/EstimateFee/EstimateFee.actions';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    toAddress,
    lockTime,
    pDecimals,
    originalAmount,
    fee,
    feeUnit,
    tokenSymbol,
    txId,
  } = props;
  const time = formatUtil.formatDateTime(lockTime * 1000);
  const amount = `${formatUtil.amount(
    originalAmount,
    pDecimals,
  )} ${tokenSymbol}`;
  const infoFactories = [
    {
      label: 'To',
      desc: toAddress,
      disabled: !toAddress,
    },
    {
      label: 'Time',
      desc: time,
      disabled: !lockTime,
    },
    {
      label: 'Amount',
      desc: amount,
      disabled: !amount,
    },
    {
      label: 'Fee',
      desc: `${fee} ${feeUnit}`,
      disabled: !fee,
    },
    {
      label: 'TxID',
      desc: `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txId}`,
      disabled: !txId,
      renderTx: true,
    },
  ];
  const onBack = async () => {
    navigation.navigate(routeNames.WalletDetail);
    await new Promise.all([
      dispatch(actionInitEstimateFee()),
      dispatch(
        actionToggleModal({
          visible: false,
          data: null,
        }),
      ),
    ]);
  };

  const onSaveAddressBook = async () =>
    await dispatch(
      actionToggleModal({
        visible: false,
        data: null,
      }),
    );

  const [btnSaveAddressBook] = useBtnSaveAddressBook({
    onSaveAddressBook,
    address: toAddress,
  });
  return (
    <WrappedComp
      {...{
        ...props,
        onBack,
        infoFactories,
        btnSaveAddressBook,
      }}
    />
  );
};

enhance.defaultProps = {
  title: '',
  toAddress: '',
  lockTime: 0,
  pDecimals: CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY,
  amountPToken: 0,
  tokenSymbol: '',
  keySaveAddressBook: '',
  txId: '',
};

enhance.propTypes = {
  title: PropTypes.string,
  toAddress: PropTypes.string,
  lockTime: PropTypes.number,
  pDecimals: PropTypes.string,
  originalAmount: PropTypes.number,
  tokenSymbol: PropTypes.string,
  keySaveAddressBook: PropTypes.string,
  txId: PropTypes.string,
};

export default compose(
  withLayout_2,
  enhance,
);
