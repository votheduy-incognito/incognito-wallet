import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const style = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: COLORS.lightGrey6,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    ...FONT.STYLE.medium,
  },
  pNode: {
    padding: 30,
    paddingTop: 40,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowColor: COLORS.lightGrey15,
    shadowOffset: { height: 2, width: 0 },
    marginBottom: 15,
    elevation: 3,
  },
  pNodeImg: {
    width: 200,
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: -20,
  },
  pNodeButton: {
    marginBottom: 35,
  },
  buyButton: {
    backgroundColor: COLORS.dark2,
  },
  buyText: {
    textAlign: 'center',
    color: COLORS.lightGrey9,
    marginBottom: 15,
  },
  vNodeTitle: {
    textAlign: 'center',
    color: COLORS.lightGrey9,
    marginTop: 35,
    marginBottom: 15,
  },
  vNodeText: {
    color: COLORS.dark1,
  },
  vNodeButton: {
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowColor: COLORS.lightGrey15,
    shadowOffset: { height: 2, width: 0 },
    marginBottom: 50,
    borderWidth: 1,
    elevation: 3,
    backgroundColor: COLORS.white,
  }
});

export default style;
