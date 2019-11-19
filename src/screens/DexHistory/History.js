import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon } from 'react-native-elements';
import {View, Text, ActivityIndicator, TouchableOpacity} from '@components/core';
import { COLORS } from '@src/styles';
import stylesheet from './style';

const History = ({ inputToken, inputValue, outputToken, outputValue, status, type, onPress, isLastItem }) => (
  <TouchableOpacity style={[stylesheet.history, stylesheet.row, isLastItem && stylesheet.lastItem]} onPress={onPress}>
    <View style={[stylesheet.shortInfo]}>
      <Text style={stylesheet.historyType}>{_.capitalize(type || 'Trade')}</Text>
      <Text style={stylesheet.shortDesc} numberOfLines={2}>
        {`${inputValue} ${inputToken} to ${outputValue} ${outputToken}`}
      </Text>
    </View>
    <View style={[stylesheet.textRight, stylesheet.row, stylesheet.historyStatus]}>
      {status === undefined ?
        <ActivityIndicator size="small" style={stylesheet.textRight} /> :
        <Text style={[stylesheet.textRight, stylesheet[status]]}>{_.capitalize(status)}</Text>
      }
      <View style={stylesheet.icon}>
        <Icon name="chevron-right" color={COLORS.lightGrey1} />
      </View>
    </View>
  </TouchableOpacity>
);

History.defaultProps = {
  status: undefined,
};

History.propTypes = {
  inputToken: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  outputToken: PropTypes.string.isRequired,
  outputValue: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string,
};

export default History;
