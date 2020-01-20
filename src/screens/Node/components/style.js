import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingVertical: 25,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowColor: '#DCDDDD',
    shadowOffset: { height: 2, width: 0 },
    marginBottom: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.transparent,
  },
  row: {
    flexDirection: 'row',
  },
  itemLeft: {
    marginRight: 'auto',
  },
  itemRight: {
    marginLeft: 'auto',
  },
  itemCenter: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  imageWrapper: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  desc: {
    marginTop: 15,
  },
  greyText: {
    color: COLORS.lightGrey1,
  },
  greenText: {
    color: COLORS.green,
  },
  withdrawMenuItem: {
    flexDirection: 'row',
    opacity: 0.4,
  },
  withdrawText: {
    marginRight: 15,
  },
  stakeButton: {
    height: 30,
    minWidth: 80,
  },
  loading: {
    marginLeft: 10,
  },
  hidden: {
    opacity: 0,
  },
  fixButton: {
    backgroundColor: COLORS.dark3,
  },
  centerAlign: {
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    width: 20,
    height: 16,
    resizeMode: 'contain',
  },
  disabled: {
    opacity: 0.6,
  },
});

export const rewardStyle = StyleSheet.create({
  slider: {
    height: 130,
    marginBottom: 20,
    width: 220,
    marginLeft: 20,
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLeft: {
    marginRight: 'auto',
  },
  itemRight: {
    marginLeft: 'auto',
  },
  itemCenter: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dot: {
    width: 16,
    height: 2,
    borderRadius: 0,
    backgroundColor: COLORS.lightGrey5,
  },
  activeDot: {
    width: 16,
    height: 2,
    borderRadius: 0,
    backgroundColor: COLORS.primary,
  },
  balance: {
    fontSize: 20,
  }
});

export default style;
