import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

const SEGMENT_HEIGHT = 32;

export const styles = StyleSheet.create({
  container: {
    height: SEGMENT_HEIGHT,
    borderRadius: SEGMENT_HEIGHT / 2,
    flexDirection: 'row',
    padding: 2,
    alignSelf:'baseline',
    overflow: 'hidden',
  },
  segmentStyle: {
    borderRadius: SEGMENT_HEIGHT / 2,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 64,
    height: '100%'
  },
  labelStyle: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.superMedium,
  },
  labelSelected: {
    color: COLORS.black
  },
  labelUnselected: {
    color: COLORS.newGrey
  }
});