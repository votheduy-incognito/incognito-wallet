import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const { width } = Dimensions.get('window');
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    marginTop: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    width: width,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.lightGrey6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  btn: {
    width: '33%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignContent: 'center',
    height: 120,
    alignItems: 'center',
  },
  accTitle: {
    color: COLORS.black,
  },
  titleHeader: {
    fontFamily: FONT.NAME.bold,
    fontSize: 25,
    lineHeight: 30,
  },
  tooltip: {
    bottom: 110,
  },
});

export default style;
