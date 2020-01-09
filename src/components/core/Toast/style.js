import { COLORS, DECOR } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 150,
    padding: 10,
    backgroundColor: COLORS.toastBackgroundDefault,
    maxHeight: 300,
    margin: 30,
    borderWidth: DECOR.borderWidth,
    borderRadius: 4,
    paddingTop: 20
  },
  message: {
    color: COLORS.white,
    marginHorizontal: 10,
    lineHeight: 21
  },
  warningMessage: {
    color: '#47412C'
  },
  errorContainer: {
    backgroundColor: COLORS.toastBackgroundError,
    borderColor: '#FF580F',
  },
  warningContainer: {
    backgroundColor: COLORS.toastBackgroundWarning,
    borderColor: '#FECD01',
  },
  infoContainer: {
    backgroundColor: COLORS.toastBackgroundDefault,
    borderColor: '#8C9C9D',
  },
  successContainer: {
    backgroundColor: COLORS.toastBackgroundSuccess,
    borderColor: '#019788',
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 12,
    padding: 3
  }
});

export default style;
