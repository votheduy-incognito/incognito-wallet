import React, { Component } from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  View,
  processColor,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {LineChart} from '@src/components/Charts';
import moment from 'moment';
import { BY_HOUR, BY_DAY, BY_WEEK, BY_MONTH, BY_YEAR } from '@src/screens/PriceChartCrypto/util';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const chartHeight = screenHeight - 500;

class PriceChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      marker: {
        enabled: true,
        markerColor: processColor('#2c3e50'),
        textColor: processColor('white'),
      },
    };

    this.parseChartData(props.data);

    this.x = 0;
  }

  formatDateByChartType = (d) => {
    const { chartType } = this.props;
    switch(chartType) {
    case BY_HOUR:
      return d.format('HH');
    case BY_DAY:
    case BY_WEEK:
      return d.format('D MMM');
    case BY_MONTH:
      return d.format('MMM YYYY');
    case BY_YEAR:
      return d.format('YYYY');
    default:
      return d.format('DD MMM');
    }
  };

  componentDidMount() {
    const {data} = this.props;
    this.parseChartData(data);
  }

  parseChartData(data) {
    const labels = [];
    const setData = [];

    if (!data || !data.length) {
      return;
    }

    data.forEach(item => {
      const momentObject = moment.unix(item.time);

      labels.push(this.formatDateByChartType(momentObject));
      setData.push(item.value);
    });

    const chartData = {
      labels: labels,
      datasets: [
        {
          data: setData,
          color: () => '#00D0D8', // optional
          strokeWidth: 0 // optional
        }
      ],
    };

    this.setState({data: chartData});
  }

  render() {
    const { data } = this.state;

    if (_.isEmpty(data)) {
      return null;
    }

    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={data}
            width={screenWidth - 64}
            paddingLeft={64}
            height={chartHeight}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 4, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#00D0D8'
              },
              strokeWidth: 1,
            }}
            verticalLabelRotation={90}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    flex: 1
  }
});

PriceChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.number.isRequired,
    open: PropTypes.number.isRequired,
    close: PropTypes.number.isRequired,
    shadowL: PropTypes.number.isRequired,
    shadowH: PropTypes.number.isRequired,
  })).isRequired,
  label: PropTypes.string.isRequired,
  chartType: PropTypes.number.isRequired,
  isShowAll: PropTypes.bool.isRequired
};

export default PriceChart;
