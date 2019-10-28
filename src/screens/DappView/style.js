import { COLORS, THEME, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    minHeight: 500
  },
  controlContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey6
  },
  navigateGroup: {
    flexDirection: 'row',
    marginRight: 20,
  },
  urlText: {
    flex: 1,
    fontSize: 20
  },
  btnGroup: {
    flexDirection: 'row',
    marginLeft: 20
  },
  controlBtn: {
    paddingHorizontal: 20,
  }
});

export const requestSendTxStyle = {
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  title: {
    marginVertical: 30,
    fontSize: 25,
  },
  infoContainer: {
    marginTop: 15,
    paddingBottom: 5,
    width: '100%',
    flexDirection: 'column',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey4
  },
  infoLabel: {
    ...FONT.STYLE.medium,
  },
  infoValue: {},
  groupBtn: {
    marginTop: 50,
    flexDirection: 'row'
  },
  cancelBtn: {
    marginHorizontal: 10,
    width: 150,
    backgroundColor: COLORS.lightGrey3
  },
  submitBtn: {
    marginHorizontal: 10,
    width: 150,
  }
};

export default style;
