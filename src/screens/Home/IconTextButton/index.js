import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, Text } from '@src/components/core';
import styles from './style';

const IconTextButton = ({ onPress, image, title, desc }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn} activeOpacity={0.55}>
      <Image style={styles.image} source={image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </TouchableOpacity>
  );
};

IconTextButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  image: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

export default React.memo(IconTextButton);
