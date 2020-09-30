import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';
import { ScreenWidth } from '@src/utils/devices';
import theme from '@src/styles/theme';

const style = StyleSheet.create({
  container: {
    padding: 30,
    paddingTop: 0,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    ...FONT.STYLE.medium,
    textAlign: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  pNode: {
    backgroundColor: COLORS.white,
    paddingBottom: 150,
  },
  pNodeImg: {
    alignSelf: 'center',
    marginVertical: 50,
    width: 180,
  },
  pNodeButton: {
    marginBottom: 50,
    height: theme.SIZES.button.height
  },
  buyButton: {
    backgroundColor: COLORS.white,
  },
  buyText: {
    textAlign: 'left',
    color: COLORS.black,
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: 20,
    marginBottom: 10,
  },
  getNode: {
    textAlign: 'left',
    color: COLORS.newGrey,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: 18,
  },
  arrow: {
    fontFamily: FONT.NAME.regular,
  },
});

export default style;
