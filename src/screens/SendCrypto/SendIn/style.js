import { StyleSheet } from 'react-native';
import { isIOS } from '@src/utils/platform';

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  feeText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  submitBtn: {
    marginTop: isIOS() ? 30 : 40,
    marginBottom: 50,
  },
});
