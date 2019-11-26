import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Text, TouchableOpacity, View} from '@components/core';
import routeNames from '@routers/routeNames';
import { MESSAGES, LIMIT_HISTORY } from '@screens/Dex/constants';
import { TradeHistory, DepositHistory, WithdrawHistory } from '@src/components/DexHistoryItem';
import { MAX_ERROR_TRIED, NOT_CHANGE_STATUS, TRANSFER_STATUS } from '@src/redux/actions/dex';
import { mainStyle } from '@screens/Dex/style';
import stylesheet from './style';

const HISTORY_TYPES = {
  [MESSAGES.DEPOSIT]: DepositHistory,
  [MESSAGES.WITHDRAW]: WithdrawHistory,
  [MESSAGES.TRADE]: TradeHistory,
};

class RecentHistory extends React.PureComponent {
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.focus = true;
    });

    this.blurListener = navigation.addListener('didBlur', () => {
      this.focus = false;
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
  }

  componentDidUpdate() {
    if (this.focus) {
      this.getStatus();
    }
  }

  getStatus = () => {
    const { histories, onGetHistoryStatus } = this.props;

    (histories || []).forEach(item => {
      if ((!NOT_CHANGE_STATUS.includes(item.status)) ||
        (item.status === TRANSFER_STATUS.UNSUCCESSFUL && item.errorTried < MAX_ERROR_TRIED)) {
        onGetHistoryStatus(item);
      }
    });
  };

  goToDetail(history) {
    const { navigation } = this.props;
    navigation.navigate(routeNames.DexHistoryDetail, { history });
  }

  goToHistory = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.DexHistory);
  };

  renderHistory(list, history) {
    const History = HISTORY_TYPES[history.type];
    return (
      <History
        {...history}
        key={history.txId}
        onPress={this.goToDetail.bind(this, history)}
      />
    );
  }

  render() {
    const { histories } = this.props;

    if (histories.length <= 0) {
      return null;
    }

    const allHistories = _.orderBy(histories, ['updatedAt'], ['desc']).slice(0, LIMIT_HISTORY);
    return (
      <View style={[mainStyle.content, stylesheet.recentHistory]}>
        <View style={stylesheet.container}>
          <View style={stylesheet.wrapper}>
            <Text style={stylesheet.title}>Recent activity</Text>
            <View>
              {allHistories.map(this.renderHistory.bind(this, allHistories))}
            </View>
          </View>
        </View>
        {histories?.length > LIMIT_HISTORY && (
          <TouchableOpacity onPress={this.goToHistory}>
            <Text style={stylesheet.viewHistoryText}>View more</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

RecentHistory.propTypes = {
  histories: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  onGetHistoryStatus: PropTypes.func.isRequired,
};

export default RecentHistory;
