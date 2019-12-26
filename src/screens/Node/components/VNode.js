import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import {Text, Button, Image, View, ActivityIndicator} from '@components/core';
import offlineIcon from '@src/assets/images/icons/offline_icon.png';
import onlineIcon from '@src/assets/images/icons/online_icon.png';
import moreIcon from '@src/assets/images/icons/more_icon.png';

import unfollowTokenIcon from '@src/assets/images/icons/unfollowToken.png';
import withdrawBlack from '@assets/images/icons/withdraw_black.png';
import OptionMenu from '@components/OptionMenu/OptionMenu';
import {COLORS} from '@src/styles';
import Rewards from './Rewards';
import styles from './style';

const MESSAGES = {
  ACCOUNT_NOT_FOUND: 'Associated account not found',
  STAKE_REQUIRED: 'Stake required',
  UNSTAKING: 'Unstaking in process',
};

class VNode extends React.Component {
  constructor(props) {
    super(props);
    this.removeDevice = _.debounce(props.onRemoveDevice, 100);
  }

  getDescriptionStatus = () => {
    const { item, isFetching } = this.props;

    if (isFetching) {
      return null;
    }

    const account = item.AccountName;
    const hasStaked = item.Staked;
    const isUnstaking = item.Unstaking;
    let style = styles.greyText;
    let text = `Acc: ${account}`;

    if (!account) {
      text = MESSAGES.ACCOUNT_NOT_FOUND;
    } else if (isUnstaking) {
      return (
        <View style={styles.row}>
          <Text style={[styles.desc, style]}>{MESSAGES.UNSTAKING}</Text>
        </View>
      );
    } else if (!hasStaked) {
      text = MESSAGES.STAKE_REQUIRED;
      style = styles.greenText;
    }

    return <Text style={[styles.desc, style]}>{text}</Text>;
  };

  renderMenu() {
    const menu = [];
    const { item, onUnstake, isFetching } = this.props;

    if (isFetching) {
      return null;
    }

    menu.push({
      id: 'delete',
      icon: <Image source={unfollowTokenIcon} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
      label: 'Remove virtual node',
      desc: 'Remove your virtual node.',
      handlePress: () => this.removeDevice(item),
    });

    if (item.Staked && !item.Unstaking && item.AccountName) {
      menu.push({
        id: 'unstake',
        icon: <Image source={withdrawBlack} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
        label: 'Unstake',
        desc: 'Remove your virtual node.',
        handlePress: () => onUnstake(item),
      });
    }

    return <OptionMenu data={menu} icon={<Image source={moreIcon} />} />;
  }

  render() {
    const {item, allTokens, onImportAccount, isFetching, onStake, onWithdraw, withdrawing, withdrawTxs} = this.props;
    const labelName = item.Name;
    const hasAccount = !!item.AccountName;
    const hasStaked = item.Staked;
    const rewards = item.Rewards;
    const isEmptyRewards = _.isEmpty(rewards) || !_.some(rewards, value => value > 0);
    const pendingWithdraw = withdrawing && withdrawTxs && withdrawTxs.length > 0;

    // console.debug('PENDING', labelName, isEmptyRewards, withdrawing, withdrawTxs, pendingWithdraw, withdrawTxs.length);

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={[styles.itemLeft, styles.imageWrapper]}>
            <Image source={item.IsOnline ? onlineIcon : offlineIcon} />
          </View>
          <View style={styles.itemCenter}>
            { isFetching ? <ActivityIndicator size="large" /> : <Rewards rewards={item.Rewards} allTokens={allTokens} /> }
          </View>
          <View style={[styles.itemRight, styles.imageWrapper]}>
            {this.renderMenu()}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.itemLeft}>
            <View style={styles.row}>
              <Text>Node {labelName}</Text>
            </View>
            {this.getDescriptionStatus()}
          </View>
          { !isFetching && hasAccount && (
            <View style={styles.itemRight}>
              <Button
                title="Withdraw"
                key={pendingWithdraw ? 'pending' : 'button'}
                buttonStyle={styles.withdrawButton}
                onPress={() => onWithdraw(item)}
                disabled={pendingWithdraw || isEmptyRewards}
                disabledStyle={styles.withdrawButtonDisabled}
                isAsync={pendingWithdraw}
                isLoading={pendingWithdraw}
              />
            </View>
          )}
        </View>
        { !isFetching && !hasAccount && <Button title="Import account" buttonStyle={styles.stakeButton} onPress={onImportAccount} /> }
        { !isFetching && hasAccount && !hasStaked && <Button title="Stake now" buttonStyle={styles.stakeButton} onPress={() => onStake(item)} />}
      </View>
    );
  }
}

VNode.defaultProps = {
  withdrawTxs: [],
};

VNode.propTypes = {
  item: PropTypes.object.isRequired,
  allTokens: PropTypes.array.isRequired,
  onRemoveDevice: PropTypes.func.isRequired,
  onImportAccount: PropTypes.func.isRequired,
  onStake: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  withdrawing: PropTypes.bool.isRequired,
  onUnstake: PropTypes.func.isRequired,
  withdrawTxs: PropTypes.array,
};

export default VNode;

