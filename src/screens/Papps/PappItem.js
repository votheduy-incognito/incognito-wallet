import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TouchableOpacity } from '@src/components/core';
import { pappItemStyle } from './style';

class PappItem extends Component {
  handleOpen = () => {
    const { onPress, url } = this.props;
    if (typeof onPress === 'function') {
      onPress(url);
    }
  }

  render() {
    const { image, title, desc } = this.props;
    return (
      <TouchableOpacity style={pappItemStyle.container} onPress={this.handleOpen}>
        <View style={pappItemStyle.imageContainer}>
          <Image style={pappItemStyle.image} source={image} />
        </View>
        <View style={pappItemStyle.infoContainer}>
          <Text numberOfLines={2} ellipsizeMode='tail' style={pappItemStyle.title}>{title}</Text>
          <Text numberOfLines={3} ellipsizeMode='tail' style={pappItemStyle.desc}>{desc}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

PappItem.defaultProps = {
  onPress: null
}; 

PappItem.propTypes = {
  image: PropTypes.any.isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  onPress: PropTypes.func
};

export default PappItem;