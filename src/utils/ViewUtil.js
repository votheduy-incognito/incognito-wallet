import React from 'react';
import { ActivityIndicator,Alert, View, Text, Modal, Image } from 'react-native';
import { debounce } from 'lodash';

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
