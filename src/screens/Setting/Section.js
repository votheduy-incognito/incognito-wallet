import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from '@src/components/core';
import { sectionStyle } from './style';

const SectionItem = ({ data: { icon, title, desc, handlePress } }) => (
  <TouchableOpacity style={sectionStyle.item} onPress={handlePress}>
    <View style={sectionStyle.iconContainer}>{icon}</View>
    <View style={sectionStyle.infoContainer}>
      <Text style={sectionStyle.titleItem}>{title}</Text>
      <Text>{desc}</Text>
    </View>
  </TouchableOpacity>
);

const Section = ({ label, items }) => (
  <View style={sectionStyle.container}>  
    <Text style={sectionStyle.label}>{label}</Text>
    <View style={sectionStyle.items}>
      {
        items && items.map((item, index) =>  <SectionItem key={index} data={item} />)
      }
    </View>
  </View>
);

const itemShape = PropTypes.shape({
  icon: PropTypes.node,
  title: PropTypes.string,
  desc: PropTypes.string,
  handlePress: PropTypes.func
});

Section.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(itemShape)
};

SectionItem.propTypes = {
  data: itemShape
};

export default Section;