/* eslint-disable react/prop-types */
import { Text, View, TouchableOpacity, ScrollView, RoundCornerButton } from '@components/core';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Header from '@src/components/Header';
import theme from '@src/styles/theme';
import NavigationService from '@src/services/NavigationService';
import routeNames from '@src/router/routeNames';
import BtnMoreInfo from '@src/components/Button/BtnMoreInfo';
import NodeStatus from '@screens/Node/components/NodeStatus';
import Rewards from '@screens/Node/components/Rewards';
import styles from './style';

class NodeItemDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      withdrawing: false,
      processing: false,
    };
  }

  handleWithdraw = async () => {
    const { navigation } = this.props;
    const {
      item,
      onWithdraw
    } = navigation.state.params;
    try {
      this.setState({ processing: true });
      await onWithdraw(item);
      this.setState({
        withdrawing: true,
      });
    } finally {
      this.setState({ processing: false });
    }
  };

  renderItemText = (text, value) => {
    return (
      <View style={[styles.balanceContainer, { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }]}>
        <Text style={[theme.text.boldTextStyleMedium]}>{text}</Text>
        <Text style={[theme.text.boldTextStyleMedium, { maxWidth: 200 }]} numberOfLines={1}>{value || ''}</Text>
      </View>
    );
  };

  renderUnstake = (onPress) => {
    return (
      <TouchableOpacity style={{ marginBottom: 30 }} onPress={onPress}>
        <Text style={[styles.text, styles.bold, styles.bigText]}>Unstake this Node</Text>
      </TouchableOpacity>
    );
  };

  renderNodeSettings = () => {
    const { navigation } = this.props;
    const {
      item,
    } = navigation.state.params;
    return (
      <TouchableOpacity
        onPress={() => NavigationService.navigate(routeNames.NodeUpdateWifi, { device: item })}
      >
        <Text style={[styles.text, styles.bold, styles.bigText]}>Update Node wifi</Text>
      </TouchableOpacity>
    );
  };

  renderBtn = (title, onPress, disabled = false, loading) => {
    return (
      <RoundCornerButton
        disabled={loading || disabled}
        onPress={onPress}
        title={title}
        isAsync={loading}
        isLoading={loading}
        style={[{ flex: 1, margin: 2 }, theme.BUTTON.BLUE_TYPE]}
      />
    );
  };

  render() {
    const { navigation } = this.props;
    const { withdrawing, processing } = this.state;
    const {
      rewardsList,
      onUnstake,
      onStake,
      item,
      onImport,
      withdrawTxs,
    } = navigation.state.params;

    const ip = item.Host;
    const name = item.Name;
    const hasAccount = !!item?.AccountName;

    let shouldShowWithdraw = false;
    rewardsList.forEach(element => {
      if (element?.balance > 0) {
        shouldShowWithdraw = true;
      }
    });

    const shouldRenderUnstake = item.IsUnstakable;
    let withdrawable;

    if (item.IsPNode && !item.IsFundedUnstaked && !item.IsFundedUnstaking) {
      withdrawable = item.IsFundedStakeWithdrawable;
    } else {
      withdrawable = !(withdrawing || !!_.get(withdrawTxs, item.PaymentAddress));
    }

    if (item.IsPNode && item.IsFundedUnstaking) {
      shouldShowWithdraw = false;
    }

    const shouldShowStake = item.IsUnstaked && !item.IsUnstaking;

    return (
      <View style={styles.containerDetail}>
        <Header
          title="Node details"
          rightHeader={<BtnMoreInfo onPress={()=>NavigationService.navigate(routeNames.NodeItemsHelp)} />}
        />
        <ScrollView>
          <Rewards rewards={rewardsList} />
          <View style={[{ flexDirection: 'row' }, theme.MARGIN.marginBottomDefault]}>
            {!hasAccount ? this.renderBtn('Import a keychain', onImport) : (
              <>
                {shouldShowStake && shouldShowWithdraw ? this.renderBtn(processing ? 'Withdrawing' : 'Withdraw', this.handleWithdraw, !withdrawable, processing) : null}
                {!shouldShowStake && shouldShowWithdraw ? this.renderBtn(processing ? 'Withdrawing rewards' : 'Withdraw rewards', this.handleWithdraw, !withdrawable, processing) : null}
                {shouldShowStake ? this.renderBtn(shouldShowWithdraw ? 'Stake' : 'Stake required', () => onStake(item)) : null}
              </>
            )}
          </View>
          <View style={{ marginTop: 50 }}>
            {this.renderItemText('Keychain', name)}
            {this.renderItemText('IP', ip)}
            <NodeStatus item={item} />
          </View>
          {(!!shouldRenderUnstake || !!item.IsPNode) && (
            <View style={{ marginTop: 50 }}>
              {!!shouldRenderUnstake && this.renderUnstake(() => onUnstake(item))}
              {!!item.IsPNode && this.renderNodeSettings()}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

NodeItemDetail.propTypes = {
  item: PropTypes.object.isRequired,
  onWithdraw: PropTypes.func.isRequired,
  onUnstake: PropTypes.func.isRequired,
  onStake: PropTypes.func.isRequired,
};

export default NodeItemDetail;

