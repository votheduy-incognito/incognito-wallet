export const navigationOptionsHandler = (screen, navigationOptions) => {
  const _screen = screen;
  _screen.navigationOptions = {
    ...navigationOptions,
    ...screen.navigationOptions,
    headerLeft: undefined,
  };

  return _screen;
};