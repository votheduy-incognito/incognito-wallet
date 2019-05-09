import React from 'react';
import PropTypes from 'prop-types';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import ROUTE_NAMES from '@src/router/routeNames';
import Section from './Section';

const PrivacySection = ({ navigation, seedPhrase }) => {
  const items = [
    {
      title: 'Seed Phrase',
      desc: 'To access your accounts. Save them somewhere safe and secret.',
      icon: <FaIcons name='user-secret' size={24} />,
      handlePress: () => navigation?.navigate(ROUTE_NAMES.SeedPhrase, { seedPhrase })
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
  seedPhrase: PropTypes.string
};

export default PrivacySection;