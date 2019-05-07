import React from 'react';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import Section from './Section';

const PreferencesSection = () => {
  const items = [
    {
      title: 'Language',
      desc: 'English',
      icon: <MdIcons name='language' size={24} />,
      handlePress: null
    }
  ];
  return (
    <Section
      label='Preferences'
      items={items}
    />
  );
};

PreferencesSection.propTypes = {
};

export default PreferencesSection;