import COLORS from './colors';
import DECOR from './decor';
import FONTS from './font';
import SPACINGS from './spacing';
import { scaleInApp } from './TextStyle';

const header = {
  headerHeight:  scaleInApp(55),
  backgroundColor: COLORS.primary,
  headerTintColor: COLORS.dark1
};

const opacityButton = {
  button: {
    backgroundColor: COLORS.blue,
    paddingVertical: SPACINGS.small,
    paddingHorizontal: 5,
    borderRadius: DECOR.borderRadiusBorder,
    borderWidth: DECOR.borderWidth,
    borderColor: COLORS.transparent,
    height: DECOR.buttonHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 0
  },
  disabled: {
    backgroundColor: COLORS.lightGrey1,
  }
};

const text = {
  errorText: {
    fontSize: FONTS.SIZE.superSmall,
    color: COLORS.red
  },
  defaultTextStyle: {
    color: COLORS.dark1,
    fontSize: FONTS.SIZE.regular,
    letterSpacing: 0
  },
  defaultSize: FONTS.SIZE.regular,
  largeTitleSize: FONTS.SIZE.superLarge
};

const indicator = {
  color: COLORS.blue
};

const container = {
  padding: SPACINGS.small,
  backgroundColor: COLORS.grey
};

const toast = {
  error: {
    backgroundColor: null,
    textColor: COLORS.red
  },
  warning: {
    backgroundColor: null,
    textColor: COLORS.orange
  },
  info: {
    backgroundColor: null,
    textColor: COLORS.green
  }
};

const textInput = {
  borderBottomWidth: DECOR.borderWidth,
  borderColor: COLORS.lightGrey1
};

const divider = {
  color: COLORS.black,
  height: 1
};

const modal = {
  headerHeight: DECOR.buttonHeight
};

export default {
  header,
  opacityButton,
  text,
  indicator,
  container,
  textInput,
  toast,
  divider,
  modal,
  Button: {
    containerStyle: {
      backgroundColor: 'red'
    }
  }
};
