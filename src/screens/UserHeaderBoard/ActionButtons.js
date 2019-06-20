import { Divider, Text, TouchableOpacity, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import { actionBtnStyle } from './style';

const ActionItem = ({ action }) => (
  <TouchableOpacity
    onPress={action?.handlePress}
    style={actionBtnStyle.actionItem}
  >
    {React.cloneElement(action?.icon, {
      size: 20,
      style: actionBtnStyle.actionItemIcon
    })}
    <Text style={actionBtnStyle.actionItemLabel}>{action?.label}</Text>
  </TouchableOpacity>
);

const ActionButtons = ({ actionBtns }) => (
  <View>
    <Divider style={actionBtnStyle.divider} />
    {actionBtns.map((action, index) => (
      <ActionItem key={index} action={action} />
    ))}
  </View>
);

const actionShape = PropTypes.shape({
  icon: PropTypes.node,
  label: PropTypes.string,
  handlePress: PropTypes.func
});
ActionItem.defaultProps = {
  action: undefined
};
ActionItem.propTypes = {
  action: actionShape
};

ActionButtons.defaultProps = {
  actionBtns: undefined
};
ActionButtons.propTypes = {
  actionBtns: PropTypes.arrayOf(actionShape)
};

export default ActionButtons;
