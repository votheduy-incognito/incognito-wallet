import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@src/styles';

export const tokenListStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  itemActive: {
    backgroundColor: COLORS.lightGrey
  },
  tokenItem: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.small,
  },
  tokenIcon: {
    height: 40,
    width: 40,
    flexBasis: 40
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: SPACING.small,
  }
});


export const followTokenStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  followBtn: {

  },
  tokenList: {
    flex: 1,
    marginVertical: SPACING.small,
  },
  input: {
    flexBasis: 100
  }
});