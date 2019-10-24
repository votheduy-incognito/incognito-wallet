import { THEME, DECOR, COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  row: {
    ...THEME.textInput,
    height: DECOR.inputHeight,
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
  },
  label: {
    ...THEME.text.defaultTextStyle,
    fontSize: 14,
    marginBottom: 5,
  },
  labelFocus: {
    color: COLORS.blue
  },
  input: {
    flex: 1,
    height: DECOR.inputHeight,
    paddingVertical: 3,
    marginRight: -15,
    fontSize: 16,
    width: '100%',
    ...THEME.text.defaultTextStyle,
  },
});

export default style;
