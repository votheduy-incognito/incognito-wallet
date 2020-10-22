import { StyleSheet } from 'react-native';
import { ScreenWidth } from '@utils/devices';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    width: ScreenWidth,
    minHeight: 500,
  },
  wrapperIndicator: {
    position: 'absolute',
    left: 0,
    top: 0, right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navigation: {
    width: ScreenWidth,
    flexDirection: 'row',
    paddingLeft: 10,
    backgroundColor: 'white'
  },
  back: {
    height: 70,
    width: '25%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end'
  }
});