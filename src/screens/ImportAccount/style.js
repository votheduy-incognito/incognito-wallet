import { COLORS, THEME, UTILS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
  },
  submitBtn: {
    backgroundColor: COLORS.blue,
    marginTop: 20
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold'
  },
  randomNameField: {
    marginBottom: 20,
  },
  randomNameText: {
    maxWidth: UTILS.deviceWidth() - 130 // 30 px padding, 100px is randomNameChangeBtn's width
  },
  randomNameChangeBtn: {
    paddingHorizontal: 20,
    width: 100
  },
  randomNameChangeBtnText: {
    color: COLORS.primary
  },
  randomNameLabel: {
    fontSize: 14,
    marginBottom: 10
  },
  randomNameValue: {
    flexDirection: 'row',
  },
});

export default style;
