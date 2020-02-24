import { StyleSheet } from 'react-native';

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
    marginTop: 15,
  },
  btn: {
    width: '33%',
    alignItems: 'center',
  }
});

export default style;
