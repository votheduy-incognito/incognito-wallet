import { StyleSheet } from 'react-native';
import { FONT } from '@src/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 25,
    paddingTop: 0,
  },
  input: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    marginBottom: 50,
  },
});

export default styles;
