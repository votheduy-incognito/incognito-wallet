import { COLORS, DECOR } from '@src/styles';
import { StyleSheet } from 'react-native';

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
    textAlign: 'center',
    color: COLORS.dark1,
    fontSize: 18,
    marginVertical: 10,
    maxWidth: 300,
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
