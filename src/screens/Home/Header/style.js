import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: COLORS.dark2,
  },
  textContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.white,
    textAlign: 'center',
  },
  image: {
    marginTop: 20,
  }
});

export default style;
