import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance, getInternalTokenList, getPTokenList, setListToken } from '@src/redux/actions/token';
import { setDefaultAccount } from '@src/redux/actions/account';
import { addHistory, getHistories, updateHistory } from '@src/redux/actions/dex';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dex from './Dex';

class DexContainer extends Component {
  componentDidMount() {
    const { getHistories } = this.props;
    getHistories();
  }

  render() {
    const { wallet, navigation, histories, addHistory, updateHistory } = this.props;

    if (!wallet) return <LoadingContainer />;

    return (
      <Dex
        wallet={wallet}
        navigation={navigation}
        histories={histories}
        onAddHistory={addHistory}
        onUpdateHistory={updateHistory}
      />
    );
  }
}

const mapState = state => ({
  wallet: state.wallet,
  histories: state.dex.histories,
});

const mapDispatch = {
  setListToken,
  getBalance,
  getPTokenList,
  getInternalTokenList,
  setSelectedPrivacy,
  setDefaultAccount,
  getHistories,
  addHistory,
  updateHistory,
};

DexContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  histories: PropTypes.array.isRequired,
  getHistories: PropTypes.func.isRequired,
  addHistory: PropTypes.func.isRequired,
  updateHistory: PropTypes.func.isRequired,
};


export default connect(
  mapState,
  mapDispatch
)(DexContainer);
