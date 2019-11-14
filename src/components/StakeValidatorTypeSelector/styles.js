import { COLORS, DECOR } from '@src/styles';
import { StyleSheet } from 'react-native';
import TextStyle from '@src/styles/TextStyle';

export default StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 17,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    shadowOffset: { width: 2, height: 0 },
    elevation: 3,
    marginBottom: 10,
    borderRadius: DECOR.borderRadiusBorder
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    ...TextStyle.bigText,
    textAlign: 'center',
    color: COLORS.dark1,
    marginVertical: 10,
  },
  icon: {
    marginRight: 13
  },
  text: {
    color: COLORS.lightGrey1
  },
  activeText: {
    color: COLORS.dark1
  }
});
