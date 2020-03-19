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
    backgroundColor: COLORS.white,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  text: {
    ...FONT.STYLE.bold,
  },
});
