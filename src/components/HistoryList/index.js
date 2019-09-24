import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import HistoryList from './HistoryList';

class HistoryListContainer extends Component {
  render() {
    return <HistoryList {...this.props} />;
  }
}

export default withNavigation(HistoryListContainer);
