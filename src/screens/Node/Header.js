import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button } from '@components/core';
import routeNames from '@routers/routeNames';
import style from './style';

const Header = ({ goToScreen, isFetching }) => (
  <View style={[style.row, style.header]}>
    <Text style={style.title}>My Nodes</Text>
    <Button
      onPress={() => goToScreen(routeNames.AddNode)}
      style={style.rightItem}
      buttonStyle={style.addNodeButton}
      disabledStyle={style.addNodeButtonDisabled}
      titleStyle={style.addNodeText}
      title="Add a node"
    />
  </View>
);

Header.propTypes = {
  goToScreen: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default Header;
