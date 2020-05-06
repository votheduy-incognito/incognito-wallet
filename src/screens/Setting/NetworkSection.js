import ROUTE_NAMES from '@src/router/routeNames';
import serverService from '@src/services/wallet/Server';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { ACCOUNT } from '@src/constants/elements';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import Section from './Section';

const NetworkSection = ({ navigation, defaultServer }) => {
  const [server, setServer] = useState(null);

  const loadServers = () => {
    serverService.getDefault().then(setServer);
  };

  useEffect(() => {
    loadServers();
  }, [defaultServer?.id]);
  const items = [
    {
      title: server?.name || 'Change default server',
      desc: server?.address || '---',
      icon: <Icon type='material' name="laptop" size={20} />,
      handlePress: () => navigation?.navigate(ROUTE_NAMES.NetworkSetting, {
        onReloadedNetworks: () => loadServers()
      })
    }
  ];
  return <Section id={ACCOUNT.NETWORK} label="Network" items={items} />;
};

NetworkSection.defaultProps = {
  defaultServer: null,
};

NetworkSection.propTypes = {
  navigation: PropTypes.object.isRequired,
  defaultServer: PropTypes.object,
};

const mapState = state => ({
  defaultServer: state.server?.defaultServer
});

export default connect(mapState)(NetworkSection);
