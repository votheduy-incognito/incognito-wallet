import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export const sendReceiveGroupStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  btn: {
    marginLeft: 20.0,
    width: 20,
    height: 20,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  }
});

export const tokenInfoStyle = StyleSheet.create({
  container: {

  },
  icon: {
    marginHorizontal: 10
  },
  modalContainer: {
    backgroundColor: COLORS.white
  },
  infoContainer: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center' ,
    marginBottom: 35
  },
  headerTextContainer: {
    marginLeft: 20,
    flex: 1
  },
  headerText: {
    fontSize: 24,
    color: COLORS.dark1
  },
  headerSubText: {
    color: COLORS.lightGrey1,
  },
  infoItems: {
    
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  infoItemLabel: {
    width: 150,
    color: COLORS.lightGrey1,
  },
  infoItemValue: {
    flex: 1,
  }
});
