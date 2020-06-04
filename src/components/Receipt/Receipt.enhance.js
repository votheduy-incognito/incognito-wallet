import React from 'react';
import PropTypes from 'prop-types';
import formatUtil from '@src/utils/format';
import { CONSTANT_COMMONS, CONSTANT_CONFIGS } from '@src/constants';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { ExHandler } from '@src/services/exception';
import { receiversSelector } from '@src/redux/selectors/receivers';
import { useBtnSaveReceiver } from '@screens/SendCrypto/FrequentReceivers/FrequentReceivers.hooks';
import { compose } from 'redux';
import { withLayout_2 } from '@src/components/Layout';
import { StackActions, NavigationActions } from 'react-navigation';

const enhance = WrappedComp => props => {
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
    keySaveAddressBook,
    txId,
  } = props;
  const { receivers } = useSelector(receiversSelector)[keySaveAddressBook];
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
  const onBack = () => {
    dispatch(
      actionToggleModal({
        visible: false,
        data: null,
      }),
    );
    const resetAction = StackActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({ routeName: routeNames.Home }),
        NavigationActions.navigate({ routeName: routeNames.Wallet }),
        NavigationActions.navigate({ routeName: routeNames.WalletDetail }),
      ],
    });
    navigation.dispatch(resetAction);
  };
  const onSaveReceivers = async () => {
    try {
      navigation.navigate(routeNames.FrequentReceiversForm, {
        info: {
          toAddress,
        },
        keySave: keySaveAddressBook,
        headerTitle: 'Save address',
      });
      await dispatch(
        actionToggleModal({
          visible: false,
          data: null,
        }),
      );
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const [btnSaveReceiver] = useBtnSaveReceiver({
    onSaveReceivers,
    receivers,
    toAddress,
  });
  return (
    <WrappedComp {...{ ...props, onBack, infoFactories, btnSaveReceiver }} />
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
