import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey2
  },
  mainContainer: {
    flex: 1,
  },
  cryptoItem: {
    marginVertical: 4
  },
  addTokenContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 100
  },
  addTokenLabel: {
    fontSize: 15
  },
  addTokenBtn: {
    fontSize: 15,
    color: COLORS.blue,
    marginVertical: 20
  }
});