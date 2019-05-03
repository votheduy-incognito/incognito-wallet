import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, Divider } from '@src/components/core';
import styleSheet from './style';

const ActionItem = ({ action }) => (
  <TouchableOpacity onPress={action?.handlePress} style={styleSheet.actionItem}>
    {React.cloneElement(action?.icon, { size: 20, style: styleSheet.actionItemIcon })}
    <Text style={styleSheet.actionItemLabel}>{action?.label}</Text>
  </TouchableOpacity>
);

const ActionButtons = ({ actionBtns }) => (
  <View>
    <Divider style={styleSheet.divider} />
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