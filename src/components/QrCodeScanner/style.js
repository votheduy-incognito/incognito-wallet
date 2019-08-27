import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    justifyContent: 'center',

  },
  desc: {
    textAlign: 'center',
    marginBottom: 20,
  }
});
