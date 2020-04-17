import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { View, Text } from '@components/core';
import {COLORS, FONT} from '@src/styles';

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  question: {
    ...FONT.STYLE.bold,
    fontSize: 16,
    color: COLORS.dark1,
    marginBottom: 6,
  },
  answer: {
    fontSize: 16,
    color: COLORS.lightGrey1,
  },
});

const Question = ({text, answer}) => (
  <View style={styles.container}>
    <Text style={styles.question}>{text}</Text>
    <Text style={styles.answer}>{answer}</Text>
  </View>
);

Question.propTypes = {
  text: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

export default React.memo(Question);
