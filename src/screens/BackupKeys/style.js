import { StyleSheet } from 'react-native';
import { COLORS, FONT, } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  doneButton: {
    marginTop: 20
  },
  doneIcon: {
    color: COLORS.white,
    fontSize: 16,
    marginHorizontal: 7,
  },
  doneText: {
    color: COLORS.white,
    fontSize: 18,
    ...FONT.STYLE.medium
  },
  accountItemContainer: {
    marginBottom: 30,
    width: '100%'
  },
  accountItemHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    marginBottom: 10,
    borderBottomColor: COLORS.lightGrey1
  },
  accountItemKey: {
    
  },
  accountItemNameText: {
    ...FONT.STYLE.medium
  },
  accountItemKeyText: {
    fontSize: 14,
    color: COLORS.lightGrey1,
  },
  copyIcon: {
    color: COLORS.lightGrey1,
    fontSize: 26
  },
  topGroup: {
    flex: 1
  },
  bottomGroup: {
    paddingTop: 30,
    backgroundColor: COLORS.lightGrey12,
    justifyContent: 'center',
  },
  bottomGroupText: {
    textAlign: 'center',
    ...FONT.STYLE.medium
  },
  saveAsBtn: {
    alignSelf: 'center',
    maxWidth: 200,
    minWidth: 130,
    marginVertical: 20,
    backgroundColor: COLORS.transparent,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  saveAsBtnText: {
    color: COLORS.primary
  },
  copyAllButton: {
    marginTop: 10,
    borderRadius: 0,
  }
});