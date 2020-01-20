import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, View, Image, Text, TouchableOpacity } from '@src/components/core';
import defaultTokenIcon from '@src/assets/images/icons/default_token_icon.png';
import styles from './styles';

class ImagePicker extends Component {

  render() {
    const { onPick, file, text, defaultImageUri, textButton, onBlur, onFocus } = this.props;
    const uri = file?.uri || defaultImageUri;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          typeof onPick === 'function' && onPick();
          typeof onFocus === 'function' && onFocus();
        }}
        onBlur={onBlur}
      >
        <View style={styles.leftContainer}>
          <Image style={styles.image} source={uri ? { uri } : defaultTokenIcon} />
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.text}>{text || 'Upload your image'}</Text>
          <Button
            titleStyle={styles.buttonText}
            style={styles.button}
            title={textButton}
            onPress={() => {
              typeof onPick === 'function' && onPick();
              typeof onFocus === 'function' && onFocus();
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

ImagePicker.defaultProps = {
  file: null,
  text: null,
  defaultImageUri: null,
  onBlur: null,
  onFocus: null,
  textButton: 'Select'
};

ImagePicker.propTypes = {
  onPick: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  file: PropTypes.object,
  text: PropTypes.string,
  defaultImageUri: PropTypes.string,
  textButton: PropTypes.string,
};

export default ImagePicker;
