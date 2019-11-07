import { COLORS, THEME, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';
import { scaleInApp } from '@src/styles/TextStyle';

const style = StyleSheet.create({
  container: {
    marginTop: 30,
    display: 'flex'
  },
  errorBox: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  retryBtn: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: COLORS.orange,
    marginVertical: 10,
    marginHorizontal: 10,
    maxWidth: 200,
    maxHeight: 40,
    borderRadius: 20,
  },
  errorText: {
    ...THEME.text.errorText,
    textAlign: 'center',
    padding: 15,
    fontSize: 14
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
    backgroundColor: COLORS.lightGrey6,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey4
  },
  feeTypeHighlight: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 0,
  },
  feeTypeFirst: {
    borderRightWidth: 1,
    borderColor: COLORS.lightGrey4
  },
  feeTypeText: {
    color: COLORS.lightGrey3,
  },
  feeTypeTextHighlight: {
    color: COLORS.dark1
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    minHeight: 60
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
    lineHeight: 20,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: 'hidden',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  rateText: {
    fontWeight: '100',
    color: COLORS.lightGrey3
  },
  box: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.lightGrey4,
    backgroundColor: COLORS.white,
    overflow: 'hidden'
  },
  feeText: {
    marginTop: 30,
    marginBottom: scaleInApp(38),
    textAlign: 'center',
    fontSize: 14
  }
});

export default style;
