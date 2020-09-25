/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { SectionItem as Section } from '@screens/Setting/features/Section';
import { isKeychainAddressSelector } from '@src/redux/selectors/receivers';
import { useSelector, useDispatch } from 'react-redux';
import { actionSelectedReceiver } from '@src/redux/actions/receivers';

const AddressBookSection = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const keychainAddress = useSelector(isKeychainAddressSelector);
  const onSelectedItem = async (data) => {
    const { keySave, address, name } = data;
    const receiver = { address, name };
    const isKeychain = keychainAddress(receiver);
    if (isKeychain) {
      return;
    }
    await dispatch(actionSelectedReceiver({ keySave, address }));
    navigation.navigate(routeNames.FrequentReceiversForm, {
      info: {
        ...data,
        toAddress: address,
      },
      keySave,
      action: 'update',
      headerTitle: 'Edit',
    });
  };
  const handleNavigateFrequentReceivers = () =>
    navigation.navigate(routeNames.FrequentReceivers, {
      onSelectedItem,
      disabledSwipe: false,
    });

  return (
    <Section
      data={{
        title: 'Address Book',
        desc: 'Manage your saved addresses',
        handlePress: handleNavigateFrequentReceivers,
      }}
    />
  );
};

AddressBookSection.propTypes = {};

export default React.memo(AddressBookSection);
