import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';
import { COLORS } from '@src/styles';
import styles from './styles';

const BaseTextInput = ({ style, ...props}) => (
  <TextInput
    placeholderTextColor={COLORS.lightGrey1}
    {...props}
    returnKeyType="done"
    autoCorrect={false}
    spellCheck={false}
    autoCompleteType="off"
    style={[styles.input, style]}
  />
);

BaseTextInput.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

BaseTextInput.defaultProps = {
  style: null
};

export default BaseTextInput;
