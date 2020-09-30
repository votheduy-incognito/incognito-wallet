import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@components/core';
import styles from './style';

const Item = ({ text }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>
        {text}
      </Text>
    </View>
  );
};

Item.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Item;
