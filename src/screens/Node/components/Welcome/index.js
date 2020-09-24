import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Text, Image, ScrollView, RoundCornerButton } from '@components/core';
import nodeImg from '@assets/images/node/node.png';
import NavigationService from '@src/services/NavigationService';
import routeNames from '@src/router/routeNames';
import theme from '@src/styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@src/styles';
import styles from './style';

const WelcomeNodes = ({ onAddPNode, onAddVNode }) => (
  <ScrollView contentContainerStyle={styles.pNode}>
    <Image style={styles.pNodeImg} source={nodeImg} resizeMode="contain" resizeMethod="resize" />
    <RoundCornerButton
      style={[styles.pNodeButton, theme.BUTTON.NODE_BUTTON]}
      onPress={onAddPNode}
      title='Add Node Device'
    />
    <Text style={styles.buyText}>Don&apos;t have a Node yet?</Text>
    <TouchableOpacity style={[theme.FLEX.rowSpaceBetweenCenter]} onPress={() => { NavigationService.navigate(routeNames.BuyNodeScreen); }}>
      <Text style={styles.getNode}>Get a Node</Text>
      <Ionicons name="ios-arrow-forward" color={COLORS.newGrey} size={20} style={styles.arrow}  />
    </TouchableOpacity>
    <Text style={[styles.buyText, theme.MARGIN.marginTop30]}>Experienced Node operators?</Text>
    <TouchableOpacity style={[theme.FLEX.rowSpaceBetweenCenter]} onPress={onAddVNode}>
      <Text style={styles.getNode}>Add Node Virtual</Text>
      <Ionicons name="ios-arrow-forward" color={COLORS.newGrey} size={20} style={styles.arrow} />
    </TouchableOpacity>
  </ScrollView>
);

WelcomeNodes.propTypes = {
  onAddVNode: PropTypes.func.isRequired,
  onAddPNode: PropTypes.func.isRequired,
};

export default React.memo(WelcomeNodes);
