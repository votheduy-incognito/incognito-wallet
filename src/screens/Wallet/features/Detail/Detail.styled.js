import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  container: { flex: 1 },
  btnTrade: {
    backgroundColor: COLORS.colorGrey,
    paddingHorizontal: 18,
  },
  titleBtnTrade: {
    color: COLORS.black,
    fontFamily: FONT.NAME.medium,
  },
});

export const groupBtnStyled = StyleSheet.create({
  groupButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnStyle: {
    width: '100%',
    maxWidth: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    padding: 13,
    backgroundColor: COLORS.colorGreyMedium,
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    color: COLORS.white,
  },
});

export const balanceStyled = StyleSheet.create({
  container: {
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 42
  },
  amount: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superLarge + 10,
    lineHeight: FONT.SIZE.superLarge + 16,
    color: COLORS.black,
    maxWidth: '80%',
  },
  amountBasePRV: {
    color: '#959599',
  },
  changePrice: {},
  hook: {
    flexDirection: 'row',
    marginTop: 10,
  },
  hookCustomStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
  },
});

export const historyStyled = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 50,
  },
});
