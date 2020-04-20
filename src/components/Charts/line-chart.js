/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  View,
} from 'react-native';
import {
  Svg,
  Circle,
  Polyline,
  Rect,
  G, Line, Text
} from 'react-native-svg';
import AbstractChart from './abstract-chart';

class LineChart extends AbstractChart {
  label = React.createRef();

  getColor = (dataset, opacity) => {
    return (dataset.color || this.props.chartConfig.color)(opacity);
  };

  getStrokeWidth = dataset => {
    return dataset.strokeWidth || this.props.chartConfig.strokeWidth || 3;
  };

  getDatas = data =>
    data.reduce((acc, item) => (item.data ? [...acc, ...item.data] : acc), []);

  getPropsForDots = (x, i) => {
    const { getDotProps, chartConfig = {} } = this.props;
    if (typeof getDotProps === 'function') {
      return getDotProps(x, i);
    }
    const { propsForDots = {} } = chartConfig;
    return { r: '4', ...propsForDots };
  };

  renderDots = config => {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      onDataPointClick
    } = config;
    const output = [];
    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);
    const {
      hidePointsAtIndex = [],
    } = this.props;

    data.forEach(dataset => {
      if (dataset.withDots === false) return;

      dataset.data.forEach((x, i) => {
        if (i !== dataset.data.length - 1) return;

        if (hidePointsAtIndex.includes(i)) {
          return;
        }
        const cx =
          paddingRight + (i * (width - paddingRight)) / dataset.data.length;
        const cy =
          ((baseHeight - this.calcHeight(x, datas, height)) / 4) * 3 +
          paddingTop;
        const onPress = () => {
          if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
            return;
          }

          onDataPointClick({
            index: i,
            value: x,
            dataset,
            x: cx,
            y: cy,
            getColor: opacity => this.getColor(dataset, opacity)
          });
        };
        output.push(
          <Circle
            key={Math.random()}
            cx={cx}
            cy={cy}
            fill="white"
            onPress={onPress}
            {...this.getPropsForDots(x, i)}
          />,
        );
      });
    });
    return output;
  };

  renderLine = config => {
    const {
      width,
      height,
      paddingRight,
      paddingTop,
      data,
      linejoinType
    } = config;
    const output = [];
    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);
    data.forEach((dataset, index) => {
      const points = dataset.data.map((d, i) => {
        const x =
          (i * (width - paddingRight)) / dataset.data.length + paddingRight;
        const y =
          ((baseHeight - this.calcHeight(d, datas, height)) / 4) * 3 +
          paddingTop;
        return `${x},${y}`;
      });
      output.push(
        <Polyline
          key={index}
          strokeLinejoin={linejoinType}
          points={points.join(' ')}
          fill="none"
          stroke={this.getColor(dataset, 0.2)}
          strokeWidth={this.getStrokeWidth(dataset)}
        />
      );
    });

    return output;
  };

  renderHorizontalLines = config => {
    const { count, width, height, paddingTop, paddingRight } = config;
    const basePosition = height - height / 4;

    return [...new Array(count + 1)].map((_, i) => {
      const y = (basePosition / count) * i + paddingTop;
      return (
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={y}
          x2={width}
          y2={y}
          {...this.getPropsForBackgroundLines()}
        />
      );
    });
  };

  renderVerticalLabels = config => {
    const {
      labels = [],
      width,
      height,
      paddingRight,
      paddingTop,
      horizontalOffset = 0,
      stackedBar = false,
      verticalLabelRotation = 0,
      formatXLabel = xLabel => xLabel
    } = config;
    const {
      xAxisLabel = '',
      xLabelsOffset = 0,
      hidePointsAtIndex = []
    } = this.props;
    const fontSize = 12;
    let fac = 1;
    if (stackedBar) {
      fac = 0.71;
    }
    return labels.map((label, i) => {
      if (hidePointsAtIndex.includes(i)) {
        return null;
      }
      const x =
        (((width - paddingRight) / labels.length) * i +
          paddingRight +
          horizontalOffset) *
        fac;
      const y = (height * 3) / 4 + paddingTop + fontSize * 2 + xLabelsOffset;
      return (
        <Text
          origin={`${x}, ${y}`}
          rotation={verticalLabelRotation}
          key={Math.random()}
          x={x}
          y={y}
          textAnchor={verticalLabelRotation === 0 ? 'middle' : 'start'}
          {...this.getPropsForLabels()}
        >
          {`${formatXLabel(label)}${xAxisLabel}`}
        </Text>
      );
    });
  };

  renderHorizontalLabels = config => {
    const {
      count,
      data,
      height,
      paddingTop,
      paddingRight,
      horizontalLabelRotation = 0,
      decimalPlaces = 2,
      formatYLabel = yLabel => yLabel
    } = config;
    const {
      yAxisLabel = '',
      yAxisSuffix = '',
      yLabelsOffset = 12,
      width,
    } = this.props;

    return [...Array(count === 1 ? 1 : count + 1).keys()].map((i) => {
      let yLabel = i * count;

      if (count === 1) {
        yLabel = `${yAxisLabel}${formatYLabel(
          data[0].toFixed(decimalPlaces)
        )}${yAxisSuffix}`;
      } else {
        const label = this.props.fromZero
          ? (this.calcScaler(data) / count) * i + Math.min(...data, 0)
          : (this.calcScaler(data) / count) * i + Math.min(...data);
        yLabel = `${yAxisLabel}${formatYLabel(
          label.toFixed(decimalPlaces)
        )}${yAxisSuffix}`;
      }

      const basePosition = height - height / 4;
      const x = paddingRight - yLabelsOffset;
      const y =
        count === 1 && this.props.fromZero
          ? paddingTop + 4
          : (height * 3) / 4 - (basePosition / count) * i + paddingTop;
      return (
        <Text
          rotation={horizontalLabelRotation}
          origin={`${x}, ${y}`}
          key={Math.random()}
          x={width + 8}
          textAnchor="start"
          y={y}
          {...this.getPropsForLabels()}
        >
          {yLabel}
        </Text>
      );
    });
  };

  render() {
    const {
      width,
      height,
      data,
      style = {},
      onDataPointClick,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      formatYLabel = yLabel => yLabel,
      formatXLabel = xLabel => xLabel,
      segments,
      transparent = false,
      paddingLeft,
    } = this.props;
    const { labels = [] } = data;
    const {
      borderRadius = 0,
      paddingTop = 16,
      paddingRight = 16,
      margin = 0,
      marginRight = 0,
      paddingBottom = 0,
    } = style;

    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation
    };

    const datas = this.getDatas(data.datasets);

    let count = Math.min(...datas) === Math.max(...datas) ? 1 : 4;
    if (segments) {
      count = segments;
    }

    const legendOffset = this.props.data.legend ? height * 0.15 : 0;

    return (
      <View style={style}>
        <Svg
          height={height + paddingBottom + legendOffset}
          width={(width + paddingLeft) - margin * 2 - marginRight}
        >
          <Rect
            width="100%"
            height={height + legendOffset}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
            fillOpacity={transparent ? 0 : 1}
          />
          <G x="0" y={legendOffset}>
            <G>
              {this.renderHorizontalLines({
                ...config,
                count: count,
                paddingTop,
                paddingRight,
              })}
            </G>
            <G>
              {this.renderHorizontalLabels({
                ...config,
                count: count,
                data: datas,
                paddingTop,
                paddingRight,
                formatYLabel,
                decimalPlaces: this.props.chartConfig.decimalPlaces,
              })}
            </G>
            <G>
              {this.renderVerticalLabels({
                ...config,
                labels,
                paddingRight,
                paddingTop,
                formatXLabel
              })}
            </G>
            <G>
              {this.renderLine({
                ...config,
                ...this.props.chartConfig,
                paddingRight,
                paddingTop,
                data: data.datasets
              })}
            </G>
            <G>
              {this.renderDots({
                ...config,
                data: data.datasets,
                paddingTop,
                paddingRight,
                onDataPointClick
              })}
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}

export default LineChart;
