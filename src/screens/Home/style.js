import {Dimensions, StyleSheet} from 'react-native';

const deviceHeight = Dimensions.get('screen').height;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: deviceHeight < 750 ? 15 : 80,
  },
  btn: {
    width: '33%',
    alignItems: 'center',
  }
});

export default style;
