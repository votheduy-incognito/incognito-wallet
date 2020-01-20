import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { retryExpiredDeposit } from '@src/services/api/history';
import { ExHandler } from '@src/services/exception';
import { Toast } from '@src/components/core';
import TxHistoryDetail from './TxHistoryDetail';

class TxHistoryDetailContainer extends Component {
  state = {
    data: null,
  };

  componentDidMount() {
    this.loadHistoryData();
  }

  loadHistoryData = () => {
    const { navigation } = this.props;
    const data = navigation?.getParam('data');

    this.setState({ data });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }

  retryExpiredDeposit = async (data) => {
    try {
      if (data) {
        const { decentralized } = data;
        await retryExpiredDeposit(data);

        const decentralizedMSg = 'Your request has been sent, we will process it soon. The history status will be not changed';
        const centralizedMSg = 'Your request has been sent, we will process it soon. The history status will be updated';
        
        Toast.showInfo(decentralized ? decentralizedMSg : centralizedMSg);
        this.goBack();
      }
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not process this expired deposit request. Please try again.').showErrorToast();
    }
  }

  render() {
    const { data } = this.state;

    if (!data) {
      return <LoadingContainer />;
    }

    return <TxHistoryDetail {...this.props} data={data} onRetryExpiredDeposit={this.retryExpiredDeposit} />;
  }
}

TxHistoryDetailContainer.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default TxHistoryDetailContainer;