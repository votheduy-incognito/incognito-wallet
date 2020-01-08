import TextStyle, { FontStyle, scaleInApp } from '@src/styles/TextStyle';
import { StyleSheet } from 'react-native';
import {COLORS} from '@src/styles';

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
    marginVertical: 50,
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
    width: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  key: {
    width: 60,
    height: 60,
    margin: 20,
    borderWidth: 1,
    borderColor: COLORS.dark1,
    borderRadius: 30,
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
    right: 20,
    top: 20,
  },
});

export default styles;
