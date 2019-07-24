import { StyleSheet } from 'react-native';
import { scaleInApp } from '@src/styles/TextStyle';
import { COLORS, THEME } from '@src/styles';

export const sizeHeader ={
  height:scaleInApp(90),
  width:'100%'
}; 

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: THEME.header.headerHeight,
    alignItems: 'center'
  },
  title: {
    color: COLORS.white,
    fontWeight: '600'
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

export default style;
