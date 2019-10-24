import { COLORS } from '@src/styles';
import { FontStyle, scaleInApp } from '@src/styles/TextStyle';
import { StyleSheet } from 'react-native';

export const itemStyle = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 20,
  },
  logo: {
    width: 30,
    height: 30,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey6
  },
  checkboxWrapper: {
    marginLeft: 'auto',
    justifyContent: 'center',
  },
  checkbox: {
    width: scaleInApp(25),
    height: scaleInApp(25),
  },
  name: {
    fontSize: scaleInApp(16),
  },
  symbol: {
    color: COLORS.lightGrey1,
    fontSize: scaleInApp(14),
    marginTop: 5,
  }
});

export const searchPTokenStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingTop: 10,
    paddingRight: 20,
  },
  inputIcon: {
    position: 'absolute',
    color: 'red',
    alignSelf: 'center',
    left: 65,
  },
  searchInput: {
    marginBottom: scaleInApp(10),
    backgroundColor: 'rgba(0, 0, 0, 0.24)',
    borderRadius: scaleInApp(18),
    paddingLeft: 40,
    paddingVertical: 2,
    marginRight: 10,
    color: COLORS.white,
    minHeight: scaleInApp(32),
    flex: 1,
  },
  cancelBtnText: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginHorizontal: 5,
    marginTop: -8,
    alignSelf: 'center',
    color: 'white',
    fontSize: scaleInApp(15),
    ...FontStyle.medium,
  },
  disabled: {
    color: COLORS.lightGrey4,
  },
  listToken: {
    marginBottom: 10,
  },
  followBtn: {
    marginTop: 15,
    marginLeft: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  followBtnIcon: {

  },
  followBtnText: {
    marginLeft: 25,
    fontSize: scaleInApp(16),
    color: COLORS.primary,
    ...FontStyle.medium,
  },
});

export const tokenTypeStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    marginTop: 30,
    marginBottom: 15,
  },
  title: {
    color: '#101111',
    marginBottom: 10,
    fontSize: scaleInApp(15),
  },
  types: {
    flexDirection: 'row',
  },
  image: {
    width: scaleInApp(18),
    height: scaleInApp(18),
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  type: {
    backgroundColor: COLORS.lightGrey6,
    marginRight: 8,
    width: scaleInApp(94),
    height: scaleInApp(73),
  },
  name: {
    marginTop: 5,
    color: COLORS.lightGrey1,
    fontSize: scaleInApp(14),
  },
  selected: {
    backgroundColor: COLORS.dark2,
  },
  selectedText: {
    backgroundColor: COLORS.dark2,
    color: COLORS.white,
  },
});

export const emptyStyle = StyleSheet.create({
  container: {
    paddingTop: '10%',
    alignItems: 'center',
    paddingHorizontal: scaleInApp(30),
  },
  image: {
    width: scaleInApp(58),
    height: scaleInApp(66),
    resizeMode: 'contain',
    marginBottom: scaleInApp(20),
  },
  title: {
    color: COLORS.dark1,
    marginBottom: scaleInApp(8),
    fontSize: scaleInApp(19),
    ...FontStyle.medium,
  },
  desc: {
    fontSize: scaleInApp(16),
    marginBottom: scaleInApp(4),
    color: COLORS.lightGrey1,
  },
  button: {
    width: '100%',
    marginTop: scaleInApp(30),
  }
});
