import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
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

  render() {
    const { data } = this.state;

    if (!data) {
      return <LoadingContainer />;
    }

    return <TxHistoryDetail {...this.props} data={data} />;
  }
}

TxHistoryDetailContainer.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default TxHistoryDetailContainer;