import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, View, Image, Text, TouchableOpacity } from '@src/components/core';
import styles from './styles';

class ImagePicker extends Component {

  render() {
    const { onPick, file, text, defaultImageUri, textButton } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={onPick}>
        <View style={styles.leftContainer}>
          {
            (file?.uri || defaultImageUri) && <Image style={styles.image} source={{ uri: file.uri || defaultImageUri }} />
          }
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.text}>{text || 'Upload your image'}</Text>
          <Button titleStyle={styles.buttonText} style={styles.button} title={textButton} onPress={() => { onPick(); }} />
        </View>
      </TouchableOpacity>
    );
  }
}

ImagePicker.defaultProps = {
  file: null,
  text: null,
  defaultImageUri: null,
  textButton: 'Select'
};

ImagePicker.propTypes = {
  onPick: PropTypes.func.isRequired,
  file: PropTypes.object,
  text: PropTypes.string,
  defaultImageUri: PropTypes.string,
  textButton: PropTypes.string,
};

export default ImagePicker;
