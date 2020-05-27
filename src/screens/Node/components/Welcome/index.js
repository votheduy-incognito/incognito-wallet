import React from 'react';
import PropTypes from 'prop-types';
import { Text, Image, View, Button, ScrollView } from '@components/core';
import nodeImg from '@assets/images/node.png';
import linkingService from '@services/linking';
import { CONSTANT_CONFIGS } from '@src/constants';
import NavigationService from '@src/services/NavigationService';
import routeNames from '@src/router/routeNames';
import BackButton from '@src/components/BackButton';
import styles from './style';

const WelcomeNodes = ({ onAddPNode, onAddVNode }) => (
  <ScrollView style={styles.container}>
    <View style={styles.headerContainer}>
      <BackButton onPress={()=>NavigationService.navigate('Home')} style={{paddingRight: 15}}/>
      <Text style={styles.title}>My Nodes</Text>
    </View>
    <View style={styles.pNode}>
      <Image style={styles.pNodeImg} source={nodeImg} />
      <Button
        style={styles.pNodeButton}
        onPress={onAddPNode}
        title='Add a Node Device'
      />
      <Text style={styles.buyText}>Don&apos;t have a node yet?</Text>
      <Button
        title="Buy another Node"
        buttonStyle={styles.buyButton}
        onPress={() => { NavigationService.navigate(routeNames.BuyNodeScreen); }}
      />
    </View>

    <View>
      <Text style={styles.vNodeTitle}>Experienced node operators</Text>
      <Button
        titleStyle={styles.vNodeText}
        buttonStyle={styles.vNodeButton}
        onPress={onAddVNode}
        title='Add a Virtual Node'
      />
    </View>
  </ScrollView>
);

WelcomeNodes.propTypes = {
  onAddVNode: PropTypes.func.isRequired,
  onAddPNode: PropTypes.func.isRequired,
};

export default WelcomeNodes;
