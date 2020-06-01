import { StyleSheet} from 'react-native';
import { COLORS, FONT, UTILS } from '@src/styles';

const deviceHeight = UTILS.deviceHeight();

console.debug('DEVICE HEIGHT', deviceHeight);

const offset = deviceHeight < 700 ? 5 : 15;

export default StyleSheet.create({
  container: {
    paddingVertical: offset,
    paddingHorizontal: 40,
    height: '100%',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    ...FONT.STYLE.bold,
  },
  description: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 20,
  },
  bold: {
    ...FONT.STYLE.bold,
  },
  coins: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10 + offset,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  coin: {
    width: '33%',
    marginVertical: 5 + offset,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  btn: {
    width: '100%',
    marginTop: 10 + offset,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  arrowIcon: {
    marginTop: 20,
  },
});
