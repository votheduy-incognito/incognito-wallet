import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SPACING } from '@src/styles';
import {boardHeight, cellHeight, cellWidth} from '../../constants';

function Loading(props) {
  const { text } = props;

  return (
    <View style={styles.layer}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: boardHeight - cellHeight / 4,
    left: cellHeight + cellWidth / 2,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT.SIZE.superSmall,
    fontWeight: 'bold',
    marginVertical: SPACING.small
  }
});

Loading.propTypes = {
  text: PropTypes.string,
};

Loading.defaultProps = {
  text: '',
};

export default React.memo(Loading);
