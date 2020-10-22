import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  arrowWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey18,
  },
  arrow: {
    height: 40,
    resizeMode: 'contain',
  },
  btnPreview: { marginVertical: 50, backgroundColor: COLORS.blue5, height: 50 },
  error: {
    color: COLORS.red,
    fontSize: 14,
    marginTop: -10,
  },
});
