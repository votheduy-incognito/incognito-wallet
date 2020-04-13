import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CheckedGreenIcon} from '@src/components/Icons';
import {useSelector, useDispatch} from 'react-redux';
import {
  activeFlowSelector,
  createStakeSelector,
  stakeDataSelector,
} from '@screens/Stake/stake.selector';
import {COLORS, FONT} from '@src/styles';
import {BtnDefault} from '@src/components/Button';
import PropTypes from 'prop-types';
import {useNavigation} from 'react-navigation-hooks';
import {actionToggleModal} from '@src/components/Modal';
import routeNames from '@src/router/routeNames';
import {DEPOSIT_FLOW} from '@screens/Stake/stake.constant';
import Hook from '@screens/Stake/features/Hook';
import format from '@src/utils/format';
import LocalDatabase from '@src/utils/LocalDatabase';
import withShowStatus from './ShowStatus.enhance';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
    marginTop: 10,
  },
  break: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.lightGrey5,
    marginVertical: 25,
  },
  warning: {
    color: '#f40000',
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    textAlign: 'center',
  },
  btnSubmit: {
    marginTop: 25,
  },
});

export const BlockChecked = props => {
  const {title} = props;
  return (
    <View style={styled.heading}>
      <CheckedGreenIcon />
      <Text style={styled.title}>{title}</Text>
    </View>
  );
};

const ShowStatus = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    account,
    amount,
    headerTitle,
    btnSubmitStatus,
    titleStatus,
    warningStatus,
    activeFlow,
  } = useSelector(activeFlowSelector);
  const {backup} = useSelector(createStakeSelector);
  const {symbol, pDecimals} = useSelector(stakeDataSelector);
  const hookFactories = [
    {
      id: 0,
      leftText: 'Amount:',
      rightText: `${format.amountFull(amount, pDecimals)} ${symbol} `,
    },
    {
      id: 1,
      leftText: `${headerTitle}:`,
      rightText: account?.name || account?.AccountName,
    },
  ];
  const onHandlePress = async () => {
    switch (activeFlow) {
    case DEPOSIT_FLOW: {
      if (backup) {
        break;
      }
      await LocalDatabase.saveBackupStakeKey();
      navigation.navigate(routeNames.BackupKeys);
      break;
    }
    default:
      break;
    }
    await dispatch(actionToggleModal());
  };
  return (
    <View style={styled.container}>
      <BlockChecked title={titleStatus} />
      {hookFactories.map(item => (
        <Hook data={item} key={item.id} />
      ))}
      {!!warningStatus && (
        <View style={styled.warningContainer}>
          <View style={styled.break} />
          <Text style={styled.warning}>{warningStatus}</Text>
        </View>
      )}

      <BtnDefault
        title={btnSubmitStatus}
        btnStyle={styled.btnSubmit}
        onPress={onHandlePress}
      />
    </View>
  );
};

ShowStatus.propTypes = {};

BlockChecked.propTypes = {
  title: PropTypes.string.isRequired,
};

export default withShowStatus(ShowStatus);
