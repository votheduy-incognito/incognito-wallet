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
    flexDirection: 'row'
  },
  label: {
    ...THEME.text.defaultTextStyle,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 5,
  },
  labelFocus: {
    color: COLORS.blue
  },
  input: {
    flex: 1,
    height: DECOR.inputHeight,
    paddingVertical: 3,
    fontSize: 20,
    color: COLORS.black,
  },
  focus: {
    borderColor: COLORS.blue,
    borderBottomWidth: DECOR.borderWidth + 0.5
  }
});

export default style;
