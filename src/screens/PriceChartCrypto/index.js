import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PriceChart from '@src/components/PriceChart';
import axios from 'axios';
import moment from 'moment';
import LoadingContainer from '@src/components/LoadingContainer';
import { View } from '@src/components/core';
import PriceChartSelector from '@src/components/HeaderRight/PriceChartSelector';
import SimpleInfo from '@src/components/SimpleInfo';

function round(number) {
  return Number.parseFloat(number).toFixed(5);
}

function parseData(rawData: Array, pair) {
  return rawData?.map(data => ({
    time: data.time * 1000,
    open: data.open,
    close: data.close,
    shadowH: data.high,
    shadowL: data.low,
    marker: `${pair}\n${moment(data.time * 1000).format('DD MMM YYYY HH:mm')}\n---\nOpen: ${round(data.open)}\nClose: ${round(data.close)}\nHigh: ${round(data.high)}\nLow: ${round(data.low)}`
  }));
}

// TODO: should get the list from pool (hard code is enough for now)
const PAIRS = ['PRV-pBAT','PRV-pBNB','PRV-pBTC','PRV-pCRO','PRV-pDAI','PRV-pETH','PRV-pHOT','PRV-pKEY','PRV-pMCO','PRV-pMUA','PRV-pNEO','PRV-pOMG','PRV-pONE','PRV-pPAX','PRV-pREN','PRV-pRSV','PRV-pSAI','PRV-pWTC','PRV-pXMR','PRV-pXYO','PRV-pZIL','PRV-pZRX','PRV-pZUM','PRV-pBAND','PRV-pBUSD','PRV-pLINK','PRV-pTOMO','PRV-pTUSD','PRV-pUSDC','PRV-pUSDT','PRV-pWaBi','pBAT-pETH','pBTC-pETH','pBTC-pXMR','pBTC-pZRX','pMUA-pETH','pXMR-pETH','pXYO-pETH','pZIL-pXYO','PRV-pMATIC','pDAI-pTOMO','pDAI-pTUSD','pDAI-pUSDT','pONE-pUSDT','pTOMO-pBTC','pTUSD-pETH','pUSDC-pDAI','pUSDC-pMCO','pUSDT-pBTC','pUSDT-pFTM','pUSDT-pVNC','pUSDT-pXMR','pUSDC-pBUSD','pUSDC-pUSDT','pUSDT-pTOMO','pUSDC-pMATIC'];

const DEFAULT_PAIR = 'PRV-pUSDT';

class PriceChartCrypto extends Component {
  state = {
    data: null,
    label: null
  };

  static navigationOptions = ({ navigation }) => {
    const { handleSelectPair, currentPair } = navigation.state.params || {};
    return {
      headerRight: (
        <View>
          <PriceChartSelector currentPair={currentPair} pairs={PAIRS} onPress={handleSelectPair} />
        </View>
      )
    };
  };

  componentWillMount() {
    const { navigation } = this.props;
    const { pair } = navigation.state?.params || {};
    navigation?.setParams({
      handleSelectPair: this.handleSelectPair,
    });

    this.handleSelectPair(pair || DEFAULT_PAIR);
  }

  getPriceData(pair) {
    const intervalMs = 6 * 3600; // 6 hrs
    return axios.get(`https://prices.incognito.best/api/candles/${pair}?granularity=${intervalMs}&start=1552987804&end=${Math.round(Date.now()/1000)}`)
      .then(res => res?.data);
  }

  handleSelectPair = (pair) => {
    // reset
    this.setState({ data: null }, async () => {
      const data = await this.getPriceData(pair);

      if (data instanceof Array) {
        const { navigation } = this.props;
        this.setState({ label: pair, data: parseData(data, pair) });
        
        navigation?.setParams({
          currentPair: pair,
        });
      }
    });
  }

  render() {
    const { label, data } = this.state;
    return !data ? <LoadingContainer /> : (
      data.length ? <PriceChart label={label} data={data} /> : <SimpleInfo text={label} subText='does not have any data' />
    );
  }
}

PriceChartCrypto.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default PriceChartCrypto;