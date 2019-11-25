import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    color: COLORS.white,
    fontSize: FONT.SIZE.small,
    textAlign: 'center',
    width: 200,
    marginTop: 20,
    marginBottom: 10,
  },
});
