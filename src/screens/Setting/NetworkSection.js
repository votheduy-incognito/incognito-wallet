import React from 'react';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import Section from './Section';

const NetworkSection = () => {
  const items = [
    {
      title: 'Local',
      desc: 'http://',
      icon: <MdIcons name='laptop' size={24} />,
      handlePress: null
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
};

export default NetworkSection;