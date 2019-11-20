import PropTypes from 'prop-types';
import React from 'react';
import { RefreshControl } from 'react-native';
import {connect} from 'react-redux';
import _ from 'lodash';
import {ScrollView, Text, View} from '@components/core';
import {getHistories, getHistoryStatus, NOT_CHANGE_STATUS} from '@src/redux/actions/dex';
import routeNames from '@routers/routeNames';
import BaseScreen from '@screens/BaseScreen';
import HeaderBar from '@components/HeaderBar/HeaderBar';
import {COLORS} from '@src/styles';
import {MESSAGES} from '@screens/Dex/constants';
import TradeHistory from './TradeHistory';
import DepositHistory from './DepositHistory';
import WithdrawHistory from './WithdrawHistory';
import stylesheet from './style';

const HISTORY_TYPES = {
  [MESSAGES.DEPOSIT]: DepositHistory,
  [MESSAGES.WITHDRAW]: WithdrawHistory,
  [MESSAGES.TRADE]: TradeHistory,
};

const appRecently = [];

class DexHistory extends BaseScreen {
  state = {
    recently: undefined,
  };

  static instance;

  componentDidMount() {
    const { navigation } = this.props;
    this.loadData();
    DexHistory.instance = this;

    this.listener = navigation.addListener('didFocus', this.loadData);
  }

  componentWillUnmount() {
    DexHistory.instance = null;
    this.listener.remove();
  }

  loadData = () => {
    const { isFetching } = this.state;
    const { getHistories } = this.props;

    if (isFetching) {
      return;
    }

    this.setState({ isFetching: true });
    getHistories()
      .then(this.getStatus);
  };

  getStatus = () => {
    const { histories, getHistoryStatus } = this.props;
    const recently = appRecently;
    histories.forEach(item => {
      if (!NOT_CHANGE_STATUS.includes(item.status)) {
        getHistoryStatus(item);
        if (!recently.includes(item)) {
          recently.push(item.txId);
        }
      }
    });

    this.setState({ recently, isFetching: false });
  };

  goToDetail(history) {
    const { navigation } = this.props;
    navigation.navigate(routeNames.DexHistoryDetail, { history });
  }

  renderHeader = () => {
    const options= {
      title: 'History',
      headerBackground: COLORS.dark2,
    };
    const { navigation } = this.props;
    return (
      <HeaderBar
        index={1}
        navigation={navigation}
        scene={{ descriptor: {options} }}
      />
    );
  };

  renderHistory(list, history, index) {
    const History = HISTORY_TYPES[history.type];
    return (
      <History
        {...history}
        key={history.txId}
        onPress={this.goToDetail.bind(this, history)}
        isLastItem={index === list.length - 1}
      />
    );
  }

  renderList(list, title) {
    if (list.length <= 0) {
      return null;
    }

    return (
      <View style={stylesheet.wrapper}>
        <Text style={stylesheet.title}>{title}</Text>
        <View>
          {list.map(this.renderHistory.bind(this, list))}
        </View>
      </View>
    );
  }

  render() {
    let { histories } = this.props;
    const { recently, isFetching } = this.state;

    if (recently === undefined) {
      histories = [];
    }

    const allHistories = _.orderBy([...histories], (item) => item.lockTime ? item.lockTime : 0, ['desc']);
    const recentlyHistories = _.remove(allHistories, item => recently.includes(item.txId));

    return (
      <View style={stylesheet.container}>
        {this.renderHeader()}
        <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.loadData} />}>
          <View style={stylesheet.listContainer}>
            {this.renderList(recentlyHistories, 'Recent activity')}
            {this.renderList(allHistories, 'Past activity')}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapState = state => ({
  histories: state.dex.histories,
});

const mapDispatch = {
  getHistories,
  getHistoryStatus,
};

DexHistory.propTypes = {
  histories: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  getHistories: PropTypes.func.isRequired,
  getHistoryStatus: PropTypes.func.isRequired,
};


export default connect(
  mapState,
  mapDispatch
)(DexHistory);
