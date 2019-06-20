import { COLORS, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

export const tokenListStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: SPACING.small
  },
  itemActive: {
    backgroundColor: COLORS.lightGrey
  },
  tokenIcon: {
    flexBasis: 40,
    height: 40,
    width: 40
  },
  tokenItem: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.small
  }
});

export const followTokenStyle = StyleSheet.create({
  container: {
    flex: 1
  },
  followBtn: {},
  input: {
    flexBasis: 100
  },
  tokenList: {
    flex: 1,
    marginVertical: SPACING.small
  }
});
