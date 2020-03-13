import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';
import dimensions from '@src/styles/utils';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
  },
  label: {
    color: COLORS.lightGrey1,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  btnStyle: {
    marginTop: 25,
    marginBottom: 10,
  },
  error: {
    color: COLORS.red,
    fontWeight: '300',
    fontSize: 14,
  },
  token: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    borderColor: COLORS.lightGrey5,
    borderWidth: 1,
  },
  tokenText: {
    marginLeft: 10,
    marginTop: 4,
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
  },
  toggle: {
    width: dimensions.deviceWidth() * 2,
    marginRight: -400,
    paddingRight: 405,
  },
  selector: {
    paddingLeft: 100,
    paddingRight: 25,
    left: dimensions.deviceWidth() / 2 - 30,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  }
});
