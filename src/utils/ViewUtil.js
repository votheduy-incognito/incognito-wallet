import { debounce } from 'lodash';
import React from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

const TAG = 'ViewUtil';
export const onClickView = funcOnView => {
  return debounce(funcOnView, 1000, {
    trailing: false,
    leading: true
  });
};
export const delayCallingManyTime = (funcOnView, second = 1) => {
  return debounce(funcOnView, second * 1000);
};
class ViewUtil{
  static loadingComponent =(props) => {
    return (<ActivityIndicator animating size="small" {...props} />);
  }
  static lineComponent =({style={}}) => {
    return (<View style={[{ backgroundColor:'#F0F9F9', width:'100%',height: 1},style]} />);
  }
  static showAlert=(message) =>{
    setTimeout(() => {
      Alert.alert(
        '',
        message,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true }
      );
    }, 0.5 * 1000);
  }
}

export default ViewUtil;
