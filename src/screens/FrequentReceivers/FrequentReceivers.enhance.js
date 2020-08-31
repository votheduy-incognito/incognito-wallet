import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { receiversSelector } from '@src/redux/selectors/receivers';
import { selectedPrivacySeleclor, accountSeleclor } from '@src/redux/selectors';
import { CONSTANT_KEYS } from '@src/constants';
import { isIOS } from '@src/utils/platform';
import { View, KeyboardAvoidingView } from 'react-native';
import { useSearchBox } from '@src/components/Header';
import { useNavigationParam, useFocusEffect } from 'react-navigation-hooks';
import { actionRemoveSelectedReceiver } from '@src/redux/actions/receivers';
import { filterAddressByKey } from './FrequentReceivers.utils';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const accounts = useSelector(accountSeleclor.listAccountSelector);
  const defaultAccount = useSelector(accountSeleclor?.defaultAccountSelector);
  const filterBySelectedPrivacy = !!useNavigationParam(
    'filterBySelectedPrivacy',
  );
  const { receivers: incognitoAddress } = useSelector(receiversSelector)[
    CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK
  ];
  const keychainsAddresses = accounts
    .filter(
      (account) => account?.paymentAddress !== defaultAccount?.paymentAddress,
    )
    .map((item) => ({
      name: item?.accountName,
      address: item?.paymentAddress,
    }));
  const { receivers: externalAddress } = useSelector(receiversSelector)[
    CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK
  ];
  const incognitoAddresses = incognitoAddress.filter(
    (item) => item?.address !== defaultAccount?.paymentAddress,
  );
  const extAddrFilBySelPrivacy = [
    ...externalAddress.filter((item) =>
      filterBySelectedPrivacy
        ? item?.rootNetworkName === selectedPrivacy?.rootNetworkName
        : true,
    ),
  ];
  const [_keychainsAddresses, keySearch] = useSearchBox({
    data: keychainsAddresses,
    handleFilter: () => filterAddressByKey(keychainsAddresses, keySearch),
  });
  const [_incognitoAddress] = useSearchBox({
    data: incognitoAddresses,
    handleFilter: () => filterAddressByKey(incognitoAddress, keySearch),
  });
  const [_externalAddress] = useSearchBox({
    data: extAddrFilBySelPrivacy,
    handleFilter: () => filterAddressByKey(extAddrFilBySelPrivacy, keySearch),
  });
  const receivers = [
    {
      data: _keychainsAddresses,
      label: 'Your keychains',
      keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK,
    },
    {
      data: _incognitoAddress,
      label: 'Incognito addresses',
      keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK,
    },
    {
      data: _externalAddress,
      label: 'External addresses',
      keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK,
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      dispatch(actionRemoveSelectedReceiver());
    }, []),
  );

  const isEmpty = receivers.length === 0;
  const isPlatformIOS = isIOS();
  const Wrapper = isPlatformIOS ? KeyboardAvoidingView : View;
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, Wrapper, isEmpty, receivers }} />
    </ErrorBoundary>
  );
};

export default enhance;
