import React from 'react';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import Section from './Section';

const PrivacySection = () => {
  const items = [
    {
      title: 'Seed Phrase',
      desc: 'To access your accounts. Save them somewhere safe and secret.',
      icon: <FaIcons name='user-secret' size={24} />
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
};

export default PrivacySection;