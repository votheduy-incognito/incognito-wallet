import { Text, View, TouchableOpacity } from '@components/core';
import PropTypes from 'prop-types';
import React from 'react';
import BtnStatus from '@src/components/Button/BtnStatus';
import NavigationService from '@src/services/NavigationService';
import routeNames from '@src/router/routeNames';
import BtnWithBlur from '@src/components/Button/BtnWithBlur';
import PRVRewards from '@screens/Node/components/PRVRewards';
import { parseNodeRewardsToArray } from '@screens/Node/utils';
import styles from './style';
import Loader from './Loader';

class VNode extends React.Component {
  render() {
    const {
      item,
      isFetching,
      allTokens,
      onImportAccount,
      onStake,
      onUnstake,
      onWithdraw,
      withdrawTxs,
    } = this.props;    const labelName = item.Name;
    const hasStaked = item?.IsStaked;
    const hasAccount = item?.AccountName;
    const colorStatus = item.StatusColor;

    return (
      <View>
        {isFetching ? <Loader /> : (
          <>
            <TouchableOpacity
              style={[styles.row]}
              onPress={() => NavigationService.navigate(routeNames.NodeItemDetail,
                {
                  allTokens: allTokens,
                  onUnstake: onUnstake,
                  onWithdraw: onWithdraw,
                  onStake: onStake,
                  rewardsList: parseNodeRewardsToArray(item?.Rewards, allTokens),
                  item: item,
                  onImport: onImportAccount,
                  withdrawTxs,
                })}
            >
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}}>
                  <BtnStatus backgroundColor={colorStatus} />
                  <Text style={[styles.itemLeft]} numberOfLines={1}>{labelName || '-'}</Text>
                </View>
                <View style={{ marginLeft: 30 }}>
                  <PRVRewards isDefault item={item} rewards={item.Rewards} />
                </View>
              </View>
              <View style={styles.itemRight}>
                {!hasAccount ? <BtnWithBlur text='Import' onPress={onImportAccount} /> :
                  !hasStaked ? <BtnWithBlur text='Stake' onPress={() => onStake(item)} /> : null}
              </View>
            </TouchableOpacity>
          </>
        )
        }
      </View>
    );
  }
}

VNode.propTypes = {
  item: PropTypes.object.isRequired,
  allTokens: PropTypes.array.isRequired,
  onImportAccount: PropTypes.func.isRequired,
  onStake: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  onUnstake: PropTypes.func.isRequired,
  withdrawTxs: PropTypes.object.isRequired,
};

export default VNode;

