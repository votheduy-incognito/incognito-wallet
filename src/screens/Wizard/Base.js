import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, View, Text } from '@src/components/core';
import styles from './style';

class Base extends Component {
  render() {
    const { image, title, desc, } = this.props;
    return (
      <View style={styles.baseContainer}>
        <Image
          source={image}
          style={styles.image}
          resizeMode='contain'
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>   
      </View>
    );
  }
}

Base.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  image: PropTypes.any.isRequired,
};

export default Base;