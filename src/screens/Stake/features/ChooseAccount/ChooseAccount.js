import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import {COLORS, FONT} from '@src/styles';
import {accountSeleclor} from '@src/redux/selectors';
import {useSelector, useDispatch} from 'react-redux';
import {AccountIcon} from '@src/components/Icons';
import format from '@src/utils/format';
import PropTypes from 'prop-types';
import {actionChangeFlowAccount} from '@screens/Stake/stake.actions';
import srcAccountIcon from '@src/assets/images/icons/account_staking_pool.png';
import {
  stakeDataSelector,
  activeFlowSelector,
} from '@screens/Stake/stake.selector';
import {DEPOSIT_FLOW} from '@screens/Stake/stake.constant';
import {ExHandler} from '@src/services/exception';
import {getTotalBalance} from '@screens/Stake/stake.utils';
import _ from 'lodash';
import withChoseAccount from './ChooseAccount.enhance';

const styled = StyleSheet.create({
  accountContainer: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: '50%',
  },
  account: {
    flexDirection: 'row',
    padding: 20,
    borderBottomColor: COLORS.lightGrey1,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  accountName: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
    marginLeft: 20,
    maxWidth: '100%',
    textAlign: 'left',
    flex: 1,
  },
  accountBalance: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    textAlign: 'right',
    maxWidth: 100,
    marginLeft: 5,
  },
  lastChild: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomColor: 'transparent',
  },
  icon: {
    width: 20,
    height: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
});

const Account = props => {
  const {account, lastChild} = props;
  const dispatch = useDispatch();
  const {
    pDecimals,
    symbol,
    balance,
    currentRewardRate,
    rewardDateToMilSec,
    nodeTime,
    localTime,
  } = useSelector(stakeDataSelector);
  const {activeFlow} = useSelector(activeFlowSelector);
  const shouldShowBalance = activeFlow === DEPOSIT_FLOW;
  const onChooseAccount = async () => {
    try {
      const localTimeCurrent = new Date().getTime();
      const nodeTimeCurrent = nodeTime + (localTimeCurrent - localTime);
      const balancePStake = getTotalBalance({
        nodeTime: nodeTimeCurrent,
        balance,
        currentRewardRate,
        rewardDateToMilSec,
      });
      await dispatch(
        actionChangeFlowAccount({
          account,
          balancePStake,
        }),
      );
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  return (
    <TouchableWithoutFeedback onPress={onChooseAccount}>
      <View style={[styled.account, lastChild ? styled.lastChild : null]}>
        <AccountIcon source={srcAccountIcon} style={styled.icon} />
        <Text style={styled.accountName} numberOfLines={1}>
          {account?.name || account?.AccountName}
        </Text>
        {shouldShowBalance && (
          <View style={styled.balanceContainer}>
            <Text style={styled.accountBalance} numberOfLines={1}>
              {`${format.balance(account?.value || 0, pDecimals, 4)}`}
            </Text>
            <Text style={styled.accountBalance}>{symbol}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const ChooseAccount = props => {
  const {fetchData} = props;
  const accountList = useSelector(accountSeleclor.listAccount);
  const refreshing = useSelector(accountSeleclor.isGettingBalance);
  return (
    <View style={styled.accountContainer}>
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={refreshing.length > 0}
            onRefresh={fetchData}
          />
        )}
      >
        {accountList.map((account, index) => (
          <Account
            account={account}
            key={account?.name || account?.AccountName}
            lastChild={accountList.length - 1 === index}
          />
        ))}
      </ScrollView>
    </View>
  );
};

Account.propTypes = {
  account: PropTypes.any.isRequired,
  lastChild: PropTypes.bool.isRequired,
};

ChooseAccount.propTypes = {
  fetchData: PropTypes.func.isRequired,
};

export default withChoseAccount(ChooseAccount);
