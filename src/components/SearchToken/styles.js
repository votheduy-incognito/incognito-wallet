import { COLORS, THEME } from '@src/styles';
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
  rightComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  logo: {
    width: 30,
    height: 30,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey6
  },
  infoContainer: {
    flex: 1,
  },
  toggleWrapper: {
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle: {
    padding: 5
  },
  toggleImg: {
    width: 30,
    height: 30,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  symbol: {
    fontSize: 14,
    marginTop: 5,
  },
  networkName: {
    fontSize: 14,
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row'
  }
});

export const searchPTokenStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    backgroundColor: THEME.header.backgroundColor,
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70
  },
  inputIcon: {
    width: 25,
    marginLeft: 20
  },
  searchInput: {
    color: COLORS.white,
    minHeight: 32,
    flex: 1,
  },
  cancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 70,
  },
  cancelBtnText: {
    color: 'white',
    fontSize: 15,
    ...FontStyle.bold,
  },
  disabled: {
    opacity: 0.7,
  },
  listToken: {
    marginBottom: 10,
  },
  followBtn: {
    marginTop: 15,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  followBtnIcon: {

  },
  followBtnText: {
    marginLeft: 20,
    fontSize: 16,
    color: COLORS.primary,
    ...FontStyle.medium,
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
