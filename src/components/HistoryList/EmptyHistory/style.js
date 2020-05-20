import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    flex: 1,
    minHeight: 400,
    backgroundColor: COLORS.white,
  },
  text: {
    color: COLORS.colorGreyBold,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
  },
  image: {
    marginTop: '5%',
    marginBottom: 20,
    width: 52,
    height: 60,
  },
});

export default style;
