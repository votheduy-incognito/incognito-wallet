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
    elevation: 5,
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
    marginTop: 2,
  },
  greyText: {
    color: COLORS.lightGrey1,
  },
  greenText: {
    color: COLORS.green,
  },
  withdrawButton: {
    backgroundColor: COLORS.green,
  },
  withdrawButtonDisabled: {
    opacity: 0.4,
  },
  stakeButton: {
    marginTop: 20,
    backgroundColor: COLORS.black,
  },
  loading: {
    marginLeft: 10,
  }
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
