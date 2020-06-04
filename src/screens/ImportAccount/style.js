import { COLORS, THEME, UTILS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {},
  submitBtn: {
    backgroundColor: COLORS.blue,
    marginTop: 50,
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold',
  },
  randomNameField: {
    // marginBottom: 20,
  },
  randomNameText: {
    maxWidth: UTILS.deviceWidth() - 130, // 30 px padding, 100px is randomNameChangeBtn's width
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 4,
    fontFamily: FONT.NAME.regular,
    color: COLORS.colorGreyBold,
  },
  randomNameChangeBtn: {
    paddingHorizontal: 20,
    width: 100,
  },
  randomNameChangeBtnText: {
    color: COLORS.primary,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 4,
    fontFamily: FONT.NAME.regular,
  },
  randomNameLabel: {
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 4,
    fontFamily: FONT.NAME.regular,
    marginBottom: 10,
    color: COLORS.black,
  },
  randomNameValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default style;
