import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import ROUTE_NAMES from '@src/router/routeNames';
import serverService from '@src/services/wallet/Server';
import Section from './Section';

const NetworkSection = ({ navigation }) => {
  const [ server, setServer ] = useState(null);
  useEffect(() => {
    serverService.getDefault()
      .then(setServer);
  }, []);
  const items = [
    {
      title: server?.name || 'Change default server',
      desc: server?.address || '---',
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