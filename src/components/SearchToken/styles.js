import { COLORS } from '@src/styles';
import { FontStyle } from '@src/styles/TextStyle';
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
    width: 30,
    height: 30,
  },
  name: {
    fontSize: 16,
  },
  symbol: {
    color: COLORS.lightGrey1,
    fontSize: 14,
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
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.24)',
    borderRadius: 18,
    paddingLeft: 40,
    paddingVertical: 2,
    marginRight: 10,
    color: COLORS.white,
    minHeight: 32,
    flex: 1,
  },
  cancelBtnText: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginHorizontal: 5,
    marginTop: -8,
    alignSelf: 'center',
    color: 'white',
    fontSize: 15,
    ...FontStyle.medium,
  },
  disabled: {
    opacity: 0.7,
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
    width: 30,
    height: 30,
  },
  followBtnText: {
    marginLeft: 25,
    fontSize: 16,
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
    fontSize: 15,
  },
  types: {
    flexDirection: 'row',
  },
  image: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  type: {
    backgroundColor: COLORS.lightGrey6,
    marginRight: 8,
    width: 94,
    height: 73,
  },
  name: {
    marginTop: 5,
    color: COLORS.lightGrey1,
    fontSize: 14,
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
    paddingHorizontal: 30,
  },
  image: {
    width: 58,
    height: 66,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    color: COLORS.dark1,
    marginBottom: 8,
    fontSize: 19,
    ...FontStyle.medium,
  },
  desc: {
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.lightGrey1,
  },
  button: {
    width: '100%',
    marginTop: 30,
  }
});
