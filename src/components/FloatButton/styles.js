import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

export default StyleSheet.create({
  floatBtn: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    // backgroundColor: COLORS.white,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    ...FONT.STYLE.medium,
  },
  icon: {
    width: 40, 
    height: 40 
  }
});
