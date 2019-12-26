import React from 'react';
import PropTypes from 'prop-types';
import { Text, Image, View, Button } from '@components/core';
import nodeImg from '@assets/images/node.png';
import styles from './style';

const WelcomeNodes = ({ onAddPNode, onAddVNode }) => (
  <View style={styles.container}>
    <Text style={styles.title}>My Nodes</Text>
    <View style={styles.pNode}>
      <Image source={nodeImg} />
      <Button
        titleStyle={styles.textTitleButton}
        buttonStyle={styles.button}
        onPress={onAddPNode}
        title='Add a Node Device'
      />
    </View>

    <View>
      <Text style={styles.group_first_open_text02}>Add a Node to start</Text>
      <Button
        titleStyle={styles.textTitleButton}
        buttonStyle={[styles.button,{backgroundColor:'#101111'}]}
        onPress={onAddVNode}
        title='Add a Virtual Node'
      />
    </View>
  </View>
);

WelcomeNodes.propTypes = {
  onAddVNode: PropTypes.func.isRequired,
  onAddPNode: PropTypes.func.isRequired,
};

export default WelcomeNodes;
