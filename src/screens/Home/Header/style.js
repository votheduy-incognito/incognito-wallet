import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: COLORS.dark2,
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    paddingLeft: 25,
  },
  title: {
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 8,
  },
  icon :{
    marginLeft: 'auto',
  },
});

export default style;
