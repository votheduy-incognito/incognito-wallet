import { COLORS, FONT, SPACING, DECOR } from '@src/styles';
import { StyleSheet } from 'react-native';

export const settingStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    backgroundColor: COLORS.lightGrey6
  }
});

export const sectionStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: SPACING.small
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: 60
  },
  infoContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  item: {
    flexDirection: 'row'
  },
  items: {
    marginVertical: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: COLORS.white
  },
  label: {
    ...FONT.STYLE.medium,
    fontSize: 12,
    paddingHorizontal: 20,
    color: COLORS.primary,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  titleItem: {
    fontSize: FONT.SIZE.medium
  }
});

export const accountSection = StyleSheet.create({
  itemWrapper: {
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  name: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center'
  },
  nameText: {
    marginHorizontal: 10
  },
  actionBtn: {
    flexBasis: 50,
    paddingVertical: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});