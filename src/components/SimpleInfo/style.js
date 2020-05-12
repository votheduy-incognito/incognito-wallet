import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainContainer: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  iconContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 60,
  },
  text: {
    maxWidth: 400,
    textAlign: 'center',
  },
  subText: {
    marginTop: 5,
    maxWidth: 500,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 50,
  },
});
