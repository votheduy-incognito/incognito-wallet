import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    color: COLORS.lightGrey1,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
  },
  image: {
    marginTop: '8%',
    marginBottom: 25,
  },
});

export default style;
