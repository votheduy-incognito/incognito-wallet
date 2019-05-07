import React from 'react';
import PropTypes from 'prop-types';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import ROUTE_NAMES from '@src/router/routeNames';
import Section from './Section';

const NetworkSection = ({ navigation }) => {
  const items = [
    {
      title: 'Local',
      desc: 'http://',
      icon: <MdIcons name='laptop' size={24} />,
      handlePress: () => navigation?.navigate(ROUTE_NAMES.NetworkSetting)
    }
  ];
  return (
    <Section
      label='Network'
      items={items}
    />
  );
};

NetworkSection.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default NetworkSection;