import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styledReceipt = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: FONT.NAME.bold,
    color: COLORS.dark1,
    marginTop: 40,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
  },
  divider: {
    marginVertical: 30,
  },
  backButton: {
    width: '100%',
  },
  hook: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 5,
  },
  label: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    flex: 1,
    textAlign: 'right',
    marginRight: '5%',
  },
  desc: {
    flex: 5,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.dark1,
  },
});
