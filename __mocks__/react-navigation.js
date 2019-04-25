const mock = {
  createAppContainer: jest.fn().mockReturnValue(() => null),
  createDrawerNavigator: jest.fn(),
  createMaterialTopTabNavigator: jest.fn(),
  createStackNavigator: jest.fn(),
  createSwitchNavigator: jest.fn(),
  StackActions: {
    push: jest.fn().mockImplementation(x => ({...x,  'type': 'Navigation/PUSH'})),
    replace: jest.fn().mockImplementation(x => ({...x,  'type': 'Navigation/REPLACE'})),
  },
  NavigationActions: {
    navigate: jest.fn().mockImplementation(x => x),
  }
};

module.exports = mock;