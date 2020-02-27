import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
  },
  btnStyle: {
    marginTop: 35,
  },
  error: {
    color: COLORS.red,
    fontWeight: '300',
    fontSize: 14,
  },
  token: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'row',
  },
  tokenText: {
    marginLeft: 10,
  },
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
  }
});
