import { COLORS, DECOR, FONT, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

export const accountAddressStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.small
  },
  copyIcon: {
    marginLeft: 3
  },
  qrCode: {
    marginBottom: SPACING.medium
  },
  text: {
    fontWeight: '400'
  },
  textBox: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: DECOR.borderRadiusBorder,
    borderWidth: DECOR.borderWidth,
    flexDirection: 'row',
    padding: 10
  }
});

export const accountBalanceStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SPACING.small
  },
  textBalance: {
    color: COLORS.white,
    fontSize: FONT.SIZE.superLarge,
    fontWeight: 'bold'
  },
  textSymbol: {
    color: COLORS.white,
    fontSize: FONT.SIZE.large,
    marginHorizontal: 5
  }
});

export const actionButtonStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: SPACING.small
  },
  item: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.transparent,
    margin: 3,
    paddingHorizontal: 0,
    width: 100
  },
  titleStyle: {
    color: COLORS.black,
    fontSize: FONT.SIZE.small
  }
});

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    backgroundColor: COLORS.primary
  },
  tabContainer: {
    flex: 1
  }
});
