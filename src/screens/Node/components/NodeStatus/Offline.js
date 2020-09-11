import { Text, View } from '@components/core';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './style';

const Offline = ({ isVNode, ip }) => {
  if (isVNode) {
    return (
      <View style={styles.container}>
        <Text style={styles.desc}>{`1. Make sure your VPS at IP ${ip} is running`}</Text>
        <Text style={styles.desc}>{'2. SSH into your VPS and enter this command “sudo docker ps” to check if “inc_mainnet” and “eth_mainnet” are up. If you don’t see any of them, restart the Node with this command “sudo bash run.sh”. \n\nIf this issue persists, reach out to us at go@incognito.org'}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.desc}>1. Make sure the blue light is on</Text>
      <Text style={styles.desc}>2. Make sure that your home WiFi is connected</Text>
      <Text style={styles.desc}>3. Power cycle the Node and wait a few minutes</Text>
      <Text style={styles.desc}>{'\nIf this issue persists, reach out to us at go@incognito.org'}</Text>
    </View>
  );
};

Offline.propTypes = {
  isVNode: PropTypes.bool.isRequired,
  ip: PropTypes.string.isRequired,
};

export default React.memo(Offline);

