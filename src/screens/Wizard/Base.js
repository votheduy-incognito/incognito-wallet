import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, View, Text, Button } from '@src/components/core';
import Indicator from './Indicator';
import styles from './style';

class Base extends Component {
  render() {
    const { image, title, desc, indicatorNumber, indicator, buttonText, onPress, buttonStyle } = this.props;
    return (
      <View style={styles.baseContainer}>
        <Image
          source={image}
          style={styles.image}
          resizeMode='contain'
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>   
        <Indicator number={indicatorNumber} activeIndex={indicator} style={styles.indicator} />
        <Button title={buttonText} onPress={onPress} style={[styles.button, buttonStyle]} />
      </View>
    );
  }
}

Base.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  image: PropTypes.any.isRequired,
  indicatorNumber: PropTypes.number.isRequired,
  indicator: PropTypes.number.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonStyle: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Base;