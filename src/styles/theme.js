import COLORS from './colors';
import FONTS from './font';
import SPACINGS from './spacing';
import DECOR from './decor';

const header = {
  backgroundColor: COLORS.blue,
  headerTintColor: COLORS.black
};

const opacityButton = {
  button: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: SPACINGS.medium,
    paddingVertical: SPACINGS.small,
    borderRadius: DECOR.borderRadiusBorder,
    borderWidth: DECOR.borderWidth,
    borderColor: COLORS.transparent,
    height: DECOR.buttonHeight
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center'
  }
};

const text = {
  errorText: {
    size: FONTS.SIZE.superSmall,
    color: COLORS.red
  },
  defaultSize: FONTS.SIZE.regular,
  largeTitleSize: FONTS.SIZE.superLarge,
};

const indicator = {
  color: COLORS.blue
};

const container = {
  padding: SPACINGS.small
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
  borderWidth: DECOR.borderWidth,
  borderRadius: DECOR.borderRadiusBorder,
  paddingHorizontal: SPACINGS.small,
  borderColor: COLORS.lightGrey,
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
  modal
};