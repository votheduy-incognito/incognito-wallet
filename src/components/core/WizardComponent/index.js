import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from '@src/styles';
import { ScreenWidth, ScreenHeight } from '@src/utils/devices';


const WizardAnim = ({onAnimationFinish}) => {
  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <LottieView
          autoPlay
          loop={false}
          resizeMode="cover"
          onAnimationFinish={onAnimationFinish}
          source={require('../../../assets/lottie/intro.json')}
        />
      </View>
    </View>
  );
};

export default WizardAnim;

const styles = StyleSheet.create({ 
  content: {
    width: '100%', 
    height: '100%', 
    position: 'absolute',
    alignContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center', 
    justifyContent: 'center' 
  },
  container: {
    backgroundColor: COLORS.black, 
    borderWidth: 0.5, 
    width: ScreenWidth, 
    height: ScreenHeight, 
    alignContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center', 
    justifyContent: 'center'
  }
});