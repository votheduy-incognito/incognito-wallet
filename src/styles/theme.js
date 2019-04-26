import COLORS from './colors';
import FONTS from './font';
import SPACINGS from './spacing';
import DECOR from './decor';

const header = {
  backgroundColor: COLORS.white,
  headerTintColor: COLORS.black
};

const opacityButton = {
  button: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: SPACINGS.medium,
    paddingVertical: SPACINGS.small,
    borderRadius: DECOR.borderRadiusBorder,
    borderWidth: DECOR.borderWidth
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

const textInput = {
  borderWidth: DECOR.borderWidth,
  borderRadius: DECOR.borderRadiusBorder,
  paddingHorizontal: SPACINGS.small,
  borderColor: COLORS.lightGrey,
};

export default {
  header,
  opacityButton,
  text,
  indicator,
  container,
  textInput
};