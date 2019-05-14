import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import ROUTE_NAMES from '@src/router/routeNames';
import Section from './Section';

const PrivacySection = ({ navigation, wallet }) => {
  const items = [
    {
      title: 'Seed Phrase',
      desc: 'To access your accounts. Save them somewhere safe and secret.',
      icon: <FaIcons name='user-secret' size={24} />,
      handlePress: () => navigation?.navigate(ROUTE_NAMES.SeedPhrase, { seedPhrase: wallet.Mnemonic })
    }
  ];
  return (
    <Section
      label='Privacy'
      items={items}
    />
  );
};

PrivacySection.propTypes = {
  navigation: PropTypes.object,
  wallet: PropTypes.object
};

const mapState = state => ({
  wallet: state.wallet
});

export default connect(mapState)(PrivacySection);