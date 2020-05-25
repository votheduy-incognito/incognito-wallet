import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';
import { isAndroid } from '@utils/platform';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 40,
  },
  arrowWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    marginHorizontal: 7.5,
    height: 40,
    resizeMode: 'contain',
  },
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey5,
  },
  button: {
    marginVertical: 50,
    borderRadius: 20,
    backgroundColor: COLORS.blue5,
    height: 50,
  },
  buttonTitle: {
    fontSize: 20,
    ...FONT.STYLE.medium,
  },
  error: {
    color: COLORS.red,
  },
  warning: {
    color: COLORS.orange,
  },
  bottomFloatBtn: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: isAndroid() ? 80 : 20,
    right: 0,
  },
  bottomText: {
    color: COLORS.lightGrey1,
    ...FONT.STYLE.medium,
  },
});
