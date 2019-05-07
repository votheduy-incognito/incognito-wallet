import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Container } from '@src/components/core';
import { COLORS } from '@src/styles';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import EditSetting from './EditSetting';
import { networkItemStyle } from './style';

class NetworkItem extends Component {
  constructor() {
    super();
    this.state = {
      serverId: null
    };
  }

  render() {
    const { active, network, expanded, onExpand, onActive } = this.props;
    
    return (
      <View style={networkItemStyle.container}>
        <View style={networkItemStyle.summaryContainer}>
          <TouchableOpacity onPress={onActive} style={networkItemStyle.iconContainer}>
            <MdIcons name={active ? 'star' : 'star-border'} size={24} color={active ? COLORS.primary : null} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onExpand} style={networkItemStyle.infoContainer}>
            <View style={networkItemStyle.textInfoContainer}>
              <Text style={networkItemStyle.networkName} numberOfLines={1} ellipsizeMode='tail'>{network?.name}</Text>
              <Text numberOfLines={1} ellipsizeMode='tail'>{network?.rpcServerAddress}</Text>
            </View>
            <View style={networkItemStyle.arrowIcon}>
              <MdIcons name={ expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} />
            </View>
          </TouchableOpacity>
        </View>
        {
          expanded && (
            <View style={networkItemStyle.editContainer}>
              <EditSetting />
            </View>
          )
        }
      </View>
    );
  }
}

export const networkItemShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  rpcServerAddress: PropTypes.string,
  username: PropTypes.string,
  password: PropTypes.string
});

NetworkItem.defaultProps = {
  active: false,
  expanded: false
};

NetworkItem.propTypes = {
  network: networkItemShape.isRequired,
  active: PropTypes.bool,
  expanded: PropTypes.bool,
  onActive: PropTypes.func,
  onExpand: PropTypes.func
};

export default NetworkItem;