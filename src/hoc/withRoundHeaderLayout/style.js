import {StyleSheet} from 'react-native';
import {COLORS} from '@src/styles';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey6,
  },
  header: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    paddingLeft: 25,
  },
  content: {
    flex: 1,
  },
  account: {
    flex: 1,
  },
  specialBg: {
    backgroundColor: COLORS.dark4,
    width: '100%',
    height: 1040,
    top: -920,
    position: 'absolute',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
});

export default style;
