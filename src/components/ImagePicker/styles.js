import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {},
  leftContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    flexBasis: 100,
    backgroundColor: COLORS.lightGrey10,
    marginRight: 30,
    overflow: 'hidden',
  },
  rightContainer: {
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.primary,
    maxWidth: 300,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 14,
    letterSpacing: 0,
    marginHorizontal: 30,
  },
  text: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
    color: COLORS.colorGreyBold,
    marginVertical: 10,
  },
  label: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.black,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.colorGrey,
  },
  chooseFileContainer: {
    marginLeft: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chooseFile: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.medium,
    color: COLORS.colorGreyBold,
    marginRight: 10,
  },
  hook: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default style;
