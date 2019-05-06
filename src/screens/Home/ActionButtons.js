import React from 'react';
import PropTypes from 'prop-types';
import { View, Button } from '@src/components/core';
import { actionButtonStyle } from './style';

const ActionButtons = ({ actions }) => (
  <View style={actionButtonStyle.container}>
    {
      actions.map((action, index) => (
        <Button key={index} title={action?.label} titleStyle={actionButtonStyle.titleStyle} onPress={action?.handlePress} style={actionButtonStyle.item} />
      ))
    }
  </View>
);

ActionButtons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    handlePress: PropTypes.func
  }))
};


export default ActionButtons;