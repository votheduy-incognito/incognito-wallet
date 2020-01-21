import {StyleSheet} from 'react-native';
import {FontStyle} from '@src/styles/TextStyle';
import dimension from '@src/styles/utils';

const deviceWidth = dimension.deviceWidth();

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    paddingRight: 30,
    ...FontStyle.medium,
  },
  desc: {
    marginVertical: 10,
  },
  newDesc: {
    marginTop: 20,
    lineHeight: 25,
    maxWidth: deviceWidth - 30,
  },
  icon: {
    position: 'absolute',
    top: 20,
    right: 20,
  }
});

export default styles;
