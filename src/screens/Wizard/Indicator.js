import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from '@src/components/core';
import Icons from 'react-native-vector-icons/FontAwesome';
import styles from './style';

export default class Indicator extends Component {
  renderItems = (number, activeIndex) => {
    let items = [];
    for (let i = 0; i < number; i++) {
      items.push(<Icons key={i} name={i === activeIndex ? 'dot-circle-o' : 'circle-o'} style={styles.indicatorItem} />);
    }

    return items;
  }
  render() {
    const { number, activeIndex, style } = this.props;
    return (
      <View style={[styles.indicatorContainer, style]}>
        {this.renderItems(number, activeIndex)}
      </View>
    );
  }
}

Indicator.defaultProps = {
  style: null
};

Indicator.propTypes = {
  style: PropTypes.oneOfType([ PropTypes.object, PropTypes.arrayOf(PropTypes.object) ]),
  number: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
};