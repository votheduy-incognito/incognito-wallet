import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';
import dimension from '@src/styles/utils';

const deviceWidth = dimension.deviceWidth();
const deviceHeight = dimension.deviceHeight();
let keyboardWidth = 300;
let keySize = 60;
let margin = 20;
let inputMargin = 45;

if (deviceWidth > 400) {
  if (deviceHeight > 760) {
    keyboardWidth = 360;
    keySize = 80;
  } else {
    keyboardWidth = 330;
    keySize = 70;
  }
} else if (deviceHeight < 600) {
  keyboardWidth = 240;
  margin = 10;
  inputMargin = 30;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    marginTop: 50,
    textAlign: 'center',
  },
  input: {
    width: 240,
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: inputMargin,
  },
  dot: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.dark1,
    borderRadius: 90,
    margin: 10,
  },
  active: {
    backgroundColor: COLORS.dark1,
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: keyboardWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  key: {
    width: keySize,
    height: keySize,
    margin: margin,
    borderWidth: 1,
    borderColor: COLORS.dark1,
    borderRadius: keySize / 2,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  lastKey: {
    marginLeft: 'auto',
  },
  keyText: {
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 26,
  },
  icon: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  fingerprint: {
    position: 'absolute',
    zIndex: 1,
    right: 20,
    top: 20,
  },
});

export default styles;
