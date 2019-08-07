import { COLORS, THEME, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    marginTop: 30,
    display: 'flex'
  },
  errorText: {
    ...THEME.text.errorText
  },
  label: {
    marginBottom: 8
  },
  feeTypeGroup: {
    flexDirection: 'row',
  },
  feeType: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: COLORS.lightGrey2,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey1
  },
  feeTypeHighlight: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 0,
  },
  feeTypeFirst: {
    borderRightWidth: 1,
    borderColor: COLORS.lightGrey1
  },
  feeTypeText: {
    color: COLORS.lightGrey5,
  },
  feeTypeTextHighlight: {
    color: COLORS.dark1
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    height: 55
  },
  rate: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 5,
    flex: 1,
  },
  rateTextHighlight: {
    ...FONT.STYLE.medium,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    lineHeight: 18,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: 'hidden',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  rateText: {
    fontWeight: '100',
    color: COLORS.lightGrey5
  },
  box: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.lightGrey1,
    backgroundColor: COLORS.white,
    overflow: 'hidden'
  }
});

export default style;
