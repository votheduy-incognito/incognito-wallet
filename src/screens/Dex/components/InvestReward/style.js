import { StyleSheet} from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    ...FONT.STYLE.bold,
  },
  description: {
    fontSize: 16,
    color: COLORS.lightGrey1,
    textAlign: 'center',
  },
  symbol: {
    fontSize: 18,
    marginTop: 9,
    marginLeft: 5,
    ...FONT.STYLE.medium,
  },
  reward: {
    fontSize: 36,
  },
  bold: {
    ...FONT.STYLE.bold,
  },
  btn: {
    width: '100%',
    marginTop: 80,
  },
});
