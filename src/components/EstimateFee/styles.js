import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    marginTop: 30,
    display: 'flex'
  },
  errorText: {
    ...THEME.text.errorText
  },
  feeTypeGroup: {
    flexDirection: 'row',
    marginTop: 5,
  },
  feeType: {
    padding: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey1,
  },
  feeTypeHighlight: {
    backgroundColor: COLORS.lightGrey1
  },
  feeTypeText: {
    color: COLORS.blue,
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey1,
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
    fontWeight: '900',
    textDecorationLine: 'underline'
  },
  rateText: {
    fontWeight: '100',
  },
  
});

export default style;
