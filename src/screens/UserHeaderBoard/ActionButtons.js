import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, Divider } from '@src/components/core';
import { actionBtnStyle } from './style';

const ActionItem = ({ action }) => (
  <TouchableOpacity onPress={action?.handlePress} style={actionBtnStyle.actionItem}>
    {React.cloneElement(action?.icon, { size: 20, style: actionBtnStyle.actionItemIcon })}
    <Text style={actionBtnStyle.actionItemLabel}>{action?.label}</Text>
  </TouchableOpacity>
);

const ActionButtons = ({ actionBtns }) => (
  <View>
    <Divider style={actionBtnStyle.divider} />
    {
      actionBtns.map((action, index) => <ActionItem key={index} action={action} />)
    }
  </View>
);

const actionShape = PropTypes.shape({
  icon: PropTypes.node,
  label: PropTypes.string,
  handlePress: PropTypes.func
});

ActionItem.propTypes = {
  action: actionShape
};

ActionButtons.propTypes = {
  actionBtns: PropTypes.arrayOf(actionShape)
};

export default ActionButtons;