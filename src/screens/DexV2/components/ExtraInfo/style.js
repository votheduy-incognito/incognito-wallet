import { StyleSheet } from 'react-native';
import {COLORS, UTILS} from '@src/styles';

const deviceWidth = UTILS.deviceWidth();

export default StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: COLORS.lightGrey9,
  },
  textLeft: {
    marginRight: 10,
  },
  textRight: {
    textAlign: 'right',
    maxWidth: deviceWidth - 155,
  }
});
