/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { HEADER_TITLE_RECEIVERS } from '@src/redux/types/receivers';
import { CONSTANT_KEYS } from '@src/constants';
import { StyleSheet } from 'react-native';
import Section, {
  SectionItem as Item,
} from '@screens/Setting/features/Section';

const styled = StyleSheet.create({
  styleItem: {
    marginBottom: 10,
  },
});

const AddressBookSection = () => {
  const navigation = useNavigation();
  const onSelectedItem = (data) => {
    const { keySave, ...rest } = data;
    navigation.navigate(routeNames.FrequentReceiversForm, {
      info: {
        ...rest,
        toAddress: rest?.address,
      },
      keySave,
      action: 'update',
      headerTitle: 'Edit',
    });
  };
  const handleNavigateFrequentReceivers = () =>
    navigation.navigate(routeNames.FrequentReceivers, {
      onSelectedItem,
      disabledSwipe: false
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
