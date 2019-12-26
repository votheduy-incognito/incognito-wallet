import { RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import COLORS from '@src/styles/colors';
import React from 'react';

const PrimaryRefreshControl = ({ refreshing, onRefresh }) => (
  <RefreshControl
    refreshing={refreshing}
    onRefresh={onRefresh}
    tintColor={COLORS.primary}
    colors={[COLORS.primary]}
  />
);

PrimaryRefreshControl.propTypes = {
  refreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default PrimaryRefreshControl;
