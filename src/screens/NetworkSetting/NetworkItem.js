/* eslint-disable import/no-cycle */
import { Text, TouchableOpacity, View } from '@src/components/core';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import EditSetting from './EditSetting';
import { networkItemStyle } from './style';

const NetworkItem = ({ active, network, expanded, onExpand, onActive }) => (
  <View style={networkItemStyle.container}>
    <View style={networkItemStyle.summaryContainer}>
      <TouchableOpacity
        onPress={onActive}
        style={networkItemStyle.iconContainer}
      >
        <MdIcons
          name={active ? 'star' : 'star-border'}
          size={24}
          color={active ? COLORS.primary : null}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onExpand}
        style={networkItemStyle.infoContainer}
      >
        <View style={networkItemStyle.textInfoContainer}>
          <Text
            style={networkItemStyle.networkName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {network?.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {network?.address}
          </Text>
        </View>
        <View style={networkItemStyle.arrowIcon}>
          <MdIcons
            name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
          />
        </View>
      </TouchableOpacity>
    </View>
    {expanded && (
      <View style={networkItemStyle.editContainer}>
        <EditSetting network={network} />
      </View>
    )}
  </View>
);

export const networkItemShape = PropTypes.shape({
  id: PropTypes.string,
  default: PropTypes.bool,
  name: PropTypes.string,
  address: PropTypes.string,
  username: PropTypes.string,
  password: PropTypes.string
});

NetworkItem.defaultProps = {
  active: false,
  expanded: false,
  onActive: undefined,
  onExpand: undefined
};

NetworkItem.propTypes = {
  network: networkItemShape.isRequired,
  active: PropTypes.bool,
  expanded: PropTypes.bool,
  onActive: PropTypes.func,
  onExpand: PropTypes.func
};

export default NetworkItem;
