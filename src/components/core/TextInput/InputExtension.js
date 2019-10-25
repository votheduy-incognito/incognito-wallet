import React from 'react';
import {Input} from 'react-native-elements';
import { TextInput } from '..';
// import {TextInput as RNTextInput} from 'react-native';

// const TextInput = React.memo((props) => {
//   return (
//     <RNTextInput clearButtonMode='while-editing' allowFontScaling={false} {...props} />
//   );
// });

const InputExtension = React.memo(props=>{
  const labelProps = {allowFontScaling:false,...(props?.labelProps??{})};
  const errorProps = {allowFontScaling:false,...(props?.errorProps??{})};
  return <Input inputComponent={TextInput} {...props} labelProps={labelProps} errorProps={errorProps} />;
});


export default InputExtension;