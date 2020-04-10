import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  processColor
} from 'react-native';
import PropTypes from 'prop-types';
import {LineChart} from 'react-native-charts-wrapper';
import update from 'immutability-helper';
import moment from 'moment';
import { BY_HOUR, BY_DAY, BY_WEEK, BY_MONTH, BY_YEAR } from '@src/screens/PriceChartCrypto/util';

const extractLineData = data => data.map(e => ({ y: e.close }));

class PriceChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        dataSets: [{
          values: extractLineData(props.data),
          label: props.label,
          config: {
            highlightColor: processColor('darkgray'),
            shadowColor: processColor('black'),
            shadowWidth: 1,
            shadowColorSameAsCandle: true,
            increasingColor: processColor('#71BD6A'),
            increasingPaintStyle: 'FILL',
            decreasingColor: processColor('#D14B5A')
          },
          xAxis: {},
          yAxis: {},
        }],
      },
      marker: {
        enabled: true,
        markerColor: processColor('#2c3e50'),
        textColor: processColor('white'),
      },
      
    };

    this.x = 0;
  }
  formatDateByChartType = (d) => {
    const { chartType } = this.props;
    switch(chartType) {
    case BY_HOUR: return d.format('DD MMM HH:mm');
    case BY_DAY, BY_WEEK: return d.format('DD MMM');
    case BY_MONTH: return d.format('MMM');
    case BY_YEAR: return d.format('YYYY');
    default: return d.format('DD MMM HH:mm');
    }
  }
  componentWillMount() {
    this.setState((state) => {
      const { data } = this.props;
      return update(state, {
        xAxis: {
          $set: {
            drawLabels: true,
            drawGridLines: false,
            position: 'BOTTOM',
            yOffset: 5,
            valueFormatter: data.map(item => this.formatDateByChartType(moment(item.time))),
            labelRotationAngle: -90
          }
        },
        yAxis: {
          $set: {
            left: {
              // axisMinimum: 0,
              enabled: false
            },
            right: {enabled: true}
          }
        },
        zoomXValue: {
          $set: 1
        }
      }
      );
    });
  }

  // handleSelect(event) {
  //   let entry = event.nativeEvent;
  //   if (entry == null) {
  //     this.setState({...this.state, selectedEntry: null});
  //   } else {
  //     this.setState({...this.state, selectedEntry: JSON.stringify(entry)});
  //   }

  //   console.log(event.nativeEvent);
  // }

  render() {
    const { data, marker, xAxis, yAxis } = this.state;
    const { data: dataSet, isShowAll } = this.props;
    const dataLen = dataSet?.length || 0;

    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={data}
            marker={marker}
            chartDescription={{text: 'Price chart'}}
            xAxis={xAxis}
            yAxis={yAxis}
            maxVisibleValueCount={1}
            zoom={isShowAll ? {scaleX: 10, scaleY: 1.5, xValue: dataLen, yValue: dataLen ? dataSet[dataLen - 1]?.close : 0}: {}}
            // zoom={{}}
            // onChange={(event) => console.log(event.nativeEvent)}
            // onSelect={this.handleSelect.bind(this)}
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