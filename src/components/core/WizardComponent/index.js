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
          source={require('../../../assets/lottie/wizard.json')}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
    backgroundColor: COLORS.black, 
    borderColor: COLORS.lightGrey11, 
    borderWidth: 0.5, 
    width: ScreenWidth, 
    height: ScreenHeight, 
    alignContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center', 
    justifyContent: 'center'
  }
});