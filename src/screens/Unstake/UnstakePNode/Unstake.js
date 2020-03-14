import React from 'react';
import PropTypes from 'prop-types';
import {Button, Text, View} from '@components/core';
import LoadingTx from '@components/LoadingTx/LoadingTx';
import styles from '../styles';

const Unstake = ({ device, isUnstaking, onUnstake }) => {
  const name = device.Name;
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>Node {name}</Text>
        </View>
        <View style={styles.buy}>
          <Text style={[styles.desc, styles.firstLine]}>Unstaking will complete after the next time you earn.</Text>
          <Text style={styles.desc}>Are you sure you want to unstake this node?</Text>
          <Button style={styles.button} title="Unstake" onPress={onUnstake} />
        </View>
        { isUnstaking && <LoadingTx /> }
      </View>
    </View>
  );
};

Unstake.propTypes = {
  device: PropTypes.object.isRequired,
  isUnstaking: PropTypes.bool.isRequired,
  onUnstake: PropTypes.func.isRequired,
};

Unstake.defaultProps = {};

export default Unstake;
