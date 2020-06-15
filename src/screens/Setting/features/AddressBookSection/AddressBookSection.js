import React from 'react';
import { SectionItem as Item } from '@screens/Setting/features/Section';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';

const AddressBookSection = () => {
  const navigation = useNavigation();
  const dataFactories = {
    title: 'Address book',
    desc: 'Manage your saved addresses',
    handlePress: () => navigation.navigate(routeNames.AddressBook),
  };

  return <Item data={dataFactories} />;
};

AddressBookSection.propTypes = {};

export default AddressBookSection;
