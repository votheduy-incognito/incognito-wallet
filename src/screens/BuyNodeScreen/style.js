import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';
import { ScreenWidth } from '@src/utils/devices';

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  nodeImage: {
    marginRight: 40,
  },
  backBtn: {
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    position: 'absolute',
    backgroundColor: COLORS.lightGrey5,
    opacity: 0.5,
    borderRadius: 50,
    padding: 15,
  },
  loading: {
    position: 'absolute',
    left: '50%',
    right: '50%',
    top: '50%',
    bottom: '50%',
  },
  incBtn: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    width: 25,
  },
  halfInput: {
    width: (ScreenWidth - 40) / 2 - 15,
  },
  btnAdd: {
    backgroundColor: COLORS.colorGrey,
    height: 40,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  balance: {
    fontSize: 16,
    fontFamily: FONT.NAME.regular,
    // width: ScreenWidth * 0.25,
    textAlign: 'right',
    alignContent: 'flex-end',
    alignSelf: 'center'
  },
  containerHeader: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 35,
  },
  wallet: {
    flexDirection: 'row',
    height: 30,
    paddingLeft: 5,
    marginBottom: 10,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignItems: 'center',
    alignContent: 'flex-end'
  },
  iconDropDown: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 50,
    marginEnd: 10
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderColor: COLORS.lightGrey3,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomEndRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
  },
});

export default style;
