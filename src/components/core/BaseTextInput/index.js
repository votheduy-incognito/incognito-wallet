import React from 'react';
import {TextInput} from 'react-native';

const BaseTextInput = (props) => (
  <TextInput
    {...props}
    returnKeyType="done"
  />
);

export default BaseTextInput;
