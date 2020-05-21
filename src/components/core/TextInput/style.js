import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';
import { isIOS } from '@src/utils/platform';

const style = StyleSheet.create({
  container: {
    marginBottom: isIOS() ? 20 : 10,
  },
  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.black,
  },
  input: {
    flex: 1,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.colorGreyBold,
    padding: 0,
    margin: 0,
    marginTop: 15,
  },
});

export default style;
