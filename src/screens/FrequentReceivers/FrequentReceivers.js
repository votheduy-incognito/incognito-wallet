import React from 'react';
import { View, KeyboardAvoidingView, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { receiversSelector } from '@src/redux/selectors/receivers';
import Header, { useSearchBox } from '@src/components/Header';
import { isIOS } from '@src/utils/platform';
import { useNavigationParam } from 'react-navigation-hooks';
import { DropdownMenu, ScrollView } from '@src/components/core';
import { selectedPrivacySeleclor, accountSeleclor } from '@src/redux/selectors';
import { CONSTANT_KEYS } from '@src/constants';
import PropTypes from 'prop-types';
import Item from './FrequentReceivers.item';
import EmptyList from './FrequentReceivers.empty';
import { styledModal as styled } from './FrequentReceivers.styled';
import { filterAddressByKey } from './FrequentReceivers.utils';

const ListReceivers = (props) => {
  const { receivers, isEmpty } = props;
  const onSelectedItem = useNavigationParam('onSelectedItem');
  const disabledSwipe = useNavigationParam('disabledSwipe');
  const onSelectedAddress = async (receiver = { name: '', address: '' }) => {
    if (typeof onSelectedItem === 'function') {
      return onSelectedItem(receiver);
    }
  };
  if (isEmpty) {
    return <EmptyList />;
  }
  return (
    <>
      {receivers?.map((receiver, index) => (
        <DropdownMenu
          sections={[receiver]}
          renderItem={({ item }) => {
            return (
              <Item
                {...{
                  ...item,
                  disabledSwipe,
                  keySave: receiver?.keySave,
                  onPress: () =>
                    onSelectedAddress({ ...item, keySave: receiver?.keySave }),
                }}
              />
            );
          }}
          key={index}
          style={{ marginBottom: 30 }}
        />
      ))}
    </>
  );
};

const ListAllReceivers = () => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const accounts = useSelector(accountSeleclor.listAccountSelector);
  const defaultAccount = useSelector(accountSeleclor?.defaultAccountSelector);
  const filterBySelectedPrivacy = !!useNavigationParam(
    'filterBySelectedPrivacy',
  );
  const { receivers: incognitoAddress, migrateIncognitoAddress } = useSelector(
    receiversSelector,
  )[CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK];
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

  const isEmpty = receivers.length === 0;
  const isPlatformIOS = isIOS();
  const Wrapper = isPlatformIOS ? KeyboardAvoidingView : View;
  return (
    <View style={styled.container}>
      <Header
        title="Search by name or address"
        style={styled.header}
        canSearch
      />
      <Wrapper
        behavior="padding"
        keyboardVerticalOffset={25}
        style={{
          flex: 1,
          marginHorizontal: 25,
        }}
      >
        <ScrollView>
          <ListReceivers {...{ receivers, isEmpty }} />
        </ScrollView>
      </Wrapper>
    </View>
  );
};

ListReceivers.propTypes = {
  receivers: PropTypes.array.isRequired,
  isEmpty: PropTypes.bool.isRequired,
};

export default React.memo(ListAllReceivers);
