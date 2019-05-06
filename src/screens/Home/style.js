import { StyleSheet } from 'react-native';
import { COLORS, SPACING, DECOR, FONT } from '@src/styles';

export const accountAddressStyle = StyleSheet.create({
  container: {
    padding: SPACING.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    marginBottom: SPACING.medium
  },
  textBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: DECOR.borderWidth,
    borderRadius: DECOR.borderRadiusBorder,
    padding: 10
  },
  text: {
    fontWeight: '400'
  },
  copyIcon: {
    marginLeft: 3
  }
});

export const accountBalanceStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.small,
  },
  textBalance: {
    fontSize: FONT.SIZE.superLarge,
    color: COLORS.white,
    fontWeight: 'bold'
  },
  textSymbol: {
    fontSize: FONT.SIZE.large,
    color: COLORS.white,
    marginHorizontal: 5,
  }
});

export const actionButtonStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginVertical: SPACING.small,
  },
  item: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.transparent,
    paddingHorizontal: 0,
    margin: 3,
    width: 100
  },
  titleStyle: {
    fontSize: FONT.SIZE.small,
    color: COLORS.black,
  }
});

export const homeStyle = StyleSheet.create({
  container: {
  },
  mainContainer: {
    backgroundColor: COLORS.primary,
  }
});