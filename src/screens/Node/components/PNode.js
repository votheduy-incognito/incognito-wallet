import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import {Text, Button, Image, View, ActivityIndicator, TouchableOpacity} from '@components/core';
import offlineIcon from '@src/assets/images/icons/offline_icon.png';
import onlineIcon from '@src/assets/images/icons/online_icon.png';
import moreIcon from '@src/assets/images/icons/more_icon.png';

import firmwareIcon from '@src/assets/images/icons/firmware.png';
import OptionMenu from '@components/OptionMenu/OptionMenu';
import Toast from '@components/core/Toast/Toast';
import { DialogUpdateFirmware } from '@components/DialogNotify';
import {COLORS} from '@src/styles';
import styles from './style';
import Rewards from './Rewards';

const MESSAGES = {
  UNSTAKING: 'Unstaking in process',
};

class PNode extends React.Component {
  state = {
    showUpdateFirmware: false,
  };

  getDescriptionStatus = () => {
    const { item, isFetching } = this.props;

    if (isFetching) {
      return null;
    }

    const account = item.AccountName;
    let style = styles.greyText;
    let text = `Acc: ${account}`;

    if (!account) {
      text = `Acc: ${item.Name}`;
    }

    const isUnstaking = item.Unstaking;
    if (isUnstaking) {
      return (
        <View style={styles.row}>
          <Text style={[styles.desc, style]}>{MESSAGES.UNSTAKING}</Text>
          <ActivityIndicator style={styles.loading} size="small" color={COLORS.lightGrey1} />
        </View>
      );
    }

    return <Text style={[styles.desc, style]}>{text}</Text>;
  };

  showIp = () => {
    const { item } = this.props;
    Toast.showInfo(item.Host);
  };

  updateFirmware = () => {
    this.setState({ showUpdateFirmware: true });
  };

  renderMenu() {
    const { isFetching } = this.props;
    const menu = [];

    if (isFetching) {
      return null;
    }

    menu.push({
      id: 'update',
      icon: <Image source={firmwareIcon} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
      label: 'Update firmware',
      desc: 'Get Node perform better.',
      handlePress: this.updateFirmware,
    });

    return <OptionMenu data={menu} icon={<Image source={moreIcon} />} />;
  }

  render() {
    const {item, isFetching, onWithdraw, allTokens} = this.props;
    const { showUpdateFirmware } = this.state;
    const labelName = item.Name;
    const rewards = item.Rewards;
    const isEmptyRewards = _.isEmpty(rewards) || _.some(rewards, value => !(value > 0));

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity onPress={this.showIp} style={[styles.itemLeft, styles.imageWrapper]}>
            <Image source={item.IsOnline ? onlineIcon : offlineIcon} />
          </TouchableOpacity>
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
          { !isFetching && (
            <View style={styles.itemRight}>
              <Button
                title="Withdraw"
                buttonStyle={styles.withdrawButton}
                disabledStyle={styles.withdrawButtonDisabled}
                disabled={isEmptyRewards}
                onPress={() => onWithdraw(item)}
              />
            </View>
          )}
        </View>
        <DialogUpdateFirmware
          visible={showUpdateFirmware}
          onClose={()=>
            this.setState({
              showUpdateFirmware:false
            })
          }
          device={item}
        />
      </View>
    );
  }
}

PNode.propTypes = {
  item: PropTypes.object.isRequired,
  allTokens: PropTypes.array.isRequired,
  onWithdraw: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default PNode;

