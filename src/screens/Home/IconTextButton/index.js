import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, Text, View } from '@src/components/core';
import styles from './style';

const IconTextButton = ({ onPress, image, title, desc, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.55}
      disabled={disabled}
    >
      <View style={[styles.btn, disabled && styles.disabled]}>
        <Image style={styles.image} source={image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </TouchableOpacity>
  );
};

IconTextButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  image: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

IconTextButton.defaultProps = {
  disabled: false,
};

export default React.memo(IconTextButton);
