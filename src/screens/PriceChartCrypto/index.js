import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PriceChart from '@src/components/PriceChart';
import LoadingContainer from '@src/components/LoadingContainer';
import {View} from '@src/components/core';
import PriceChartSelector from '@src/components/HeaderRight/PriceChartSelector';
import SimpleInfo from '@src/components/SimpleInfo';
import {getPriceData as getPriceDataAPI} from '@services/api/price';
import {ExHandler} from '@services/exception';
import PoolSize from '@screens/PriceChartCrypto/PoolSize';
import DashboardItem from '@components/DashboardItem';
import ChartActions from './ChartActions';
import LatestPrice from './LatestPrice';
import { BY_HOUR, BY_DAY, BY_WEEK, BY_MONTH, BY_YEAR } from './util';

const DEFAULT_PAIR = 'PRV-pZIL';

class PriceChartCrypto extends Component {
  state = {
    data: null,
    label: null,
    intervalMs: 3600,
    latestPrice: 0,
    diffPercent: 0,
    isShowAll: false,
  };

  static navigationOptions = ({ navigation }) => {
    const { handleSelectPair, pair, tokenPairs } = navigation.state.params || {};
    return {
      headerRight: (
        <PriceChartSelector currentPair={pair} pairs={tokenPairs} onPress={handleSelectPair} />
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
    try {
      const {intervalMs, isShowAll} = this.state;
      let type;

      switch(intervalMs) {
      case BY_HOUR:
        type = BY_HOUR;
        break;
      case BY_DAY:
        type = isShowAll ? BY_MONTH : BY_HOUR;
        break;
      case BY_WEEK:
        type = BY_DAY / 2;
        break;
      case BY_MONTH:
        type = BY_DAY;
        break;
      case BY_YEAR:
        type = BY_DAY * 30;
        break;
      }

      return getPriceDataAPI({pair, intervalMs: type});
    } catch (e) {
      new ExHandler(e).showErrorToast();
      return [];
    }
  }

  async handlePriceData(pair) {
    const rawData = await this.getPriceData(pair);
    const data = await this.handlingChartData(rawData);
    const latestPrice = data.length > 0 ? data[data.length -1].value : 0;
    const prevPrice = data.length > 0 ? data[0].value : 0;
    let diffPercent = ((latestPrice/prevPrice -1)*100).toFixed(2);

    if (latestPrice === prevPrice) {
      diffPercent = 0;
    }

    this.setState({data, diffPercent, latestPrice});
    return data;
  }

  handleSelectPair = (pair) => {
    this.setState({ data: null }, async () => {
      const data = await this.handlePriceData(pair);
      if (data instanceof Array) {
        const { navigation } = this.props;
        this.setState({ label: pair, data });

        navigation?.setParams({
          pair,
        });
      }
    });
  };

  handleChangePeriodTime = (intervalMs, isShowAll = false) => {
    this.setState({ intervalMs, isShowAll, data: null }, async () => {
      const {label: pair} = this.state;
      await this.handlePriceData(pair);
    });
  };

  getLatestPrice = () => {
    const { label, latestPrice } = this.state;

    if (latestPrice && latestPrice.toFixed) {
      return latestPrice.toFixed(5) + ' ' + (label || 'PRV-PRV').split('-')[1];
    }

    return latestPrice;
  };

  handlingChartData = data => {
    const { intervalMs, isShowAll } = this.state;

    if (isShowAll) {
      return data;
    }

    switch(intervalMs) {
    case BY_HOUR: {
      return data.slice(-12);
    }
    case BY_DAY: {
      return data.slice(-24);
    }
    case BY_WEEK: {
      return data.slice(-14);
    }
    case BY_MONTH: {
      return data.slice(-30);
    }
    case BY_YEAR: {
      return data.slice(-365);
    }
    default: return data;
    }
  };

  render() {
    const { navigation } = this.props;
    const { label, data, intervalMs, diffPercent, isShowAll } = this.state;
    const { tokenPairs } = navigation?.state?.params || {};
    const pair = tokenPairs.find(item => item.pair1 === label || item.pair2 === label);
    return (
      <View style={{ flex: 1 }}>
        <LatestPrice
          price={this.getLatestPrice()}
          diffPercent={diffPercent}
          otherToken={label?.split('-')[1]}
          onSwitchToken={() => this.handleSelectPair(label?.split('-').reverse().join('-'))}
        />
        {!!pair && (
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20}}>
            {/*<DashboardItem title="Volume (24hrs)" text="" />*/}
            <PoolSize pair={pair} />
          </View>
        )}
        <ChartActions value={intervalMs} isShowAll={isShowAll} onPress={this.handleChangePeriodTime} />
        {!data ? <LoadingContainer /> : data.length ? (
          <PriceChart
            onChangePeriodTime={this.handleChangePeriodTime}
            label={label}
            data={data}
            chartType={intervalMs}
            isShowAll={isShowAll}
          />
        ) :
          <SimpleInfo text={label} subText='does not have any data' />}
      </View>
    );
  }
}

PriceChartCrypto.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default PriceChartCrypto;
