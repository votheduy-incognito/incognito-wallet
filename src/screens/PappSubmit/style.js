import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  form: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
  },
  submitBtn: {
    marginTop: 20,
    flexBasis: 50,
    borderRadius: 0
  },
  input: {
    marginBottom: 15
  },
  descriptionInput: {
    height: 60,
  },
  group: {},
  groupName: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.lightGrey6,
    fontSize: 12,
    color: COLORS.lightGrey1,
    letterSpacing: 0.2,
    ...FONT.STYLE.medium
  },
  groupContent: {},
  imageSizeDesc: {
    marginBottom: 20,
    fontSize: 14,
    fontStyle: 'italic'
  },
  verifyInfoLabel: {
    fontSize: 14,
    marginBottom: 10,
    top: -2,
    fontStyle: 'italic'
  }
});
