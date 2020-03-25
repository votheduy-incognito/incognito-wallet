import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';
import { scaleInApp } from '@src/styles/TextStyle';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  content: {
    flex: 1,
    backgroundColor: '#F2F6F6'
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    marginRight: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    color: COLORS.black
  },
  submitBtn: {
    backgroundColor: COLORS.transparent,
    borderColor: COLORS.white,
    borderWidth: 2,
    overflow: 'hidden',
    minWidth: 70,
    borderRadius: 8,
    marginRight: 3,
  },
  pappItem: {
    marginVertical: 15
  },
});

export const pappItemStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    maxHeight: 600
  },
  imageContainer: {
  },
  image: {
    height: 400,
    width: '100%',
    resizeMode: 'cover'
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: scaleInApp(24),
    color: '#0E1010',
    letterSpacing: 0,
    marginVertical: 5,
    ...FONT.STYLE.medium
  },
  desc: {
    fontSize: scaleInApp(16),
    color: COLORS.lightGrey9,
    letterSpacing: 0,
    lineHeight: scaleInApp(23),
  }
});

export default style;
