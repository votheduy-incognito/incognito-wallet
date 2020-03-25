import {StyleSheet} from 'react-native';
import TextStyle, {FontStyle, scaleInApp} from '@src/styles/TextStyle';
import {COLORS} from '@src/styles';

const styles = StyleSheet.create({
  dialog_title_text: {
    fontSize: 18,
    color: COLORS.dark1,
    ...FontStyle.bold,
    textAlign: 'center',
  },
  dialog_content_text: {
    fontSize: 16,
    marginTop: 20,
    color: COLORS.lightGrey9,
    textAlign: 'center',
    flex: 1,
  },
  dialog_container:{
    flex:1,
    padding: 25,
  },
});

export default styles;
