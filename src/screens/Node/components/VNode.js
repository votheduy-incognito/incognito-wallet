import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import {Text, Button, Image, View, ActivityIndicator} from '@components/core';
import offlineIcon from '@src/assets/images/icons/offline_icon.png';
import onlineIcon from '@src/assets/images/icons/online_icon.png';
import moreIcon from '@src/assets/images/icons/more_icon.png';
import wifiOffline from '@src/assets/images/icons/offline_wifi_icon.png';
import wifiOnline from '@src/assets/images/icons/online_wifi_icon.png';
import accountKey from '@src/assets/images/icons/account_key.png';

import unfollowTokenIcon from '@src/assets/images/icons/unfollowToken.png';
import withdrawBlack from '@assets/images/icons/withdraw_black.png';
import OptionMenu from '@components/OptionMenu/OptionMenu';
import FixModal from '@screens/Node/components/FixModal';
import Rewards from './Rewards';
import styles from './style';

const MESSAGES = {
  ACCOUNT_NOT_FOUND: 'Missing account',
  STAKE_REQUIRED: 'Stake required',
  UNSTAKING: 'unstaking in process',
};

class VNode extends React.Component {
  constructor(props) {
    super(props);
    this.removeDevice = _.debounce(props.onRemoveDevice, 100);
  }

  getDescriptionStatus = () => {
    const { item, isFetching, onStake, onImportAccount } = this.props;

    if (isFetching) {
      return null;
    }

    const account = item.AccountName;
    const isUnstaking = item.Unstaking;
    const hasStaked = item.Staked;
    let text = `Acc: ${account}`;

    if (!account) {
      return (
        <View style={[styles.row, styles.desc, styles.centerAlign]}>
          <View style={[styles.row, styles.centerAlign]}>
            <Image source={accountKey} style={[styles.icon, styles.disabled]} />
            <Text style={styles.greyText}>{MESSAGES.ACCOUNT_NOT_FOUND}</Text>
          </View>
          <View style={styles.itemRight}>
            <Button
              title="Import"
              buttonStyle={styles.stakeButton}
              onPress={onImportAccount}
            />
          </View>
        </View>
      );
    } else if (isUnstaking) {
      return (
        <View style={styles.row}>
          <Text style={styles.desc}>{text} ({MESSAGES.UNSTAKING})</Text>
        </View>
      );
    } else if (!hasStaked) {
      return (
        <View style={[styles.row, styles.desc, styles.centerAlign]}>
          <View style={[styles.row, styles.centerAlign]}>
            <Image source={accountKey} style={[styles.icon]} />
            <Text>{text}</Text>
          </View>
          <View style={styles.itemRight}>
            <Button title="Stake" buttonStyle={styles.stakeButton} onPress={() => onStake(item)} />
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.row, styles.centerAlign, styles.desc]}>
        <Image source={accountKey} style={[styles.icon]} />
        <Text>{text}</Text>
      </View>
    );
  };

  renderMenu() {
    const menu = [];
    const { item, onUnstake, isFetching, onWithdraw, withdrawTxs } = this.props;

    if (isFetching) {
      return null;
    }

    const hasAccount = !!item.AccountName;

    menu.push({
      id: 'delete',
      icon: <Image source={unfollowTokenIcon} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
      label: 'Remove virtual node',
      desc: 'Remove this node from your display.',
      handlePress: () => this.removeDevice(item),
    });

    if (item.Staked && !item.Unstaking && item.AccountName) {
      menu.push({
        id: 'unstake',
        icon: <Image source={withdrawBlack} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
        label: 'Unstake',
        desc: 'Stop staking and withdraw staked amount.',
        handlePress: () => onUnstake(item),
      });
    }

    if (!isFetching && hasAccount) {
      const rewards = item.Rewards;
      const isEmptyRewards = _.isEmpty(rewards) || !_.some(rewards, value => value > 0);
      const pendingWithdraw =  !!withdrawTxs;
      let onClick = () => onWithdraw(item);
      let label = 'Withdraw';

      if (pendingWithdraw || isEmptyRewards) {
        onClick = null;
        label = (
          <View style={styles.withdrawMenuItem}>
            <Text style={styles.withdrawText}>Withdraw</Text>
            { !!pendingWithdraw && <ActivityIndicator size="small" /> }
          </View>
        );
      }

      menu.push({
        id: 'withdraw',
        icon: <Image source={withdrawBlack} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
        label: label,
        desc: 'Withdraw your rewards.',
        handlePress: onClick,
      });
    }

    return <OptionMenu data={menu} icon={<Image source={moreIcon} />} />;
  }

  render() {
    const {item, allTokens, isFetching} = this.props;
    const labelName = item.Name;

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={[styles.itemLeft, styles.imageWrapper, styles.hidden]}>
            <Image source={item.IsOnline ? onlineIcon : offlineIcon} />
          </View>
          <View style={styles.itemCenter}>
            { isFetching ? <ActivityIndicator size="large" /> : <Rewards rewards={item.Rewards} allTokens={allTokens} /> }
          </View>
          <View style={[styles.itemRight, styles.imageWrapper]}>
            {this.renderMenu()}
          </View>
        </View>
        <View>
          <View style={[styles.row, styles.centerAlign]}>
            <View style={[styles.row, styles.centerAlign]}>
              <Image source={item.IsOnline ? wifiOnline : wifiOffline} style={[styles.icon]} />
              <Text style={[styles.itemLeft, !item.isOnline && styles.greyText]}>Node {labelName}</Text>
            </View>
            {!isFetching && !item.IsOnline && (
              <View style={styles.itemRight}>
                <FixModal item={item} />
              </View>
            )}
          </View>
          {this.getDescriptionStatus()}
        </View>
      </View>
    );
  }
}

VNode.defaultProps = {
  withdrawTxs: null,
};

VNode.propTypes = {
  item: PropTypes.object.isRequired,
  allTokens: PropTypes.array.isRequired,
  onRemoveDevice: PropTypes.func.isRequired,
  onImportAccount: PropTypes.func.isRequired,
  onStake: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  onUnstake: PropTypes.func.isRequired,
  withdrawTxs: PropTypes.object,
};

export default VNode;

