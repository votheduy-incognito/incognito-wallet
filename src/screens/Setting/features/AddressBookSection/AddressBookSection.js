/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import Section, {
  SectionItem as Item,
} from '@screens/Setting/features/Section';
import { isKeychainAddressSelector } from '@src/redux/selectors/receivers';
import { useSelector } from 'react-redux';

const AddressBookSection = () => {
  const navigation = useNavigation();
  const keychainAddress = useSelector(isKeychainAddressSelector);
  const onSelectedItem = (data) => {
    const { keySave, address, name } = data;
    const receiver = { address, name };
    const isKeychain = keychainAddress(receiver);
    if (isKeychain) {
      return;
    }
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

  const itemsFactories = [
    {
      desc: 'Manage your saved addresses',
      handlePress: handleNavigateFrequentReceivers,
    },
  ];
  return (
    <Section
      label="Address Book"
      customItems={itemsFactories.map((item, key, arr) => (
        <Item data={{ ...item, lastChild: arr.length - 1 === key }} key={key} />
      ))}
    />
  );
};

AddressBookSection.propTypes = {};

export default AddressBookSection;
