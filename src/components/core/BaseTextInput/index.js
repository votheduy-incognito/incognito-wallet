import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';
import {COLORS} from '@src/styles';

const BaseTextInput = ({ style, ...props}) => (
  <TextInput
    {...props}
    returnKeyType="done"
    autoCorrect={false}
    spellCheck={false}
    autoCompleteType="off"
    style={[{ color: COLORS.black }, style]}
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
