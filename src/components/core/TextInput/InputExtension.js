import React from 'react';
import { Input } from 'react-native-elements';
import { COLORS } from '@src/styles';
import { TextInput } from '..';

const InputExtension = React.forwardRef((props, ref) => {
  const labelProps = { allowFontScaling: false, ...(props?.labelProps ?? {}) };
  const errorProps = { allowFontScaling: false, ...(props?.errorProps ?? {}) };
  const inputContainerStyle = { ...(props?.inputContainerStyle), borderBottomWidth: 0 };
  return <Input returnKeyType="done" ref={ref} errorStyle={{ color: COLORS.errorMessage }} inputComponent={TextInput} {...props} labelProps={labelProps} errorProps={errorProps} inputContainerStyle={inputContainerStyle} />;
});


export default InputExtension;
