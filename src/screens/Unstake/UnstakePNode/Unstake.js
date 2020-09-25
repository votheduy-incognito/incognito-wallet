import React from 'react';
import PropTypes from 'prop-types';
import { RoundCornerButton, Text, View } from '@components/core';
import Header from '@src/components/Header';
import { withLayout_2 } from '@components/Layout';
import styles from '../styles';

const Unstake = ({ device, isUnstaking, onUnstake }) => {
  const name = device.Name;
  return (
    <View>
      <Header title="Unstake" />
      <Text style={styles.title}>Node {name}</Text>
      <View style={styles.buy}>
        <Text style={[styles.desc, styles.firstLine]}>{isUnstaking ? 'Unstaking may take up to 21 days. This Node will unstake the next time it is selected to earn.' : 'The unstaking process will complete the next time your Node is selected to work. This may take up to 21 days.'}</Text>
        {!isUnstaking && <Text style={styles.desc}>Are you sure you want to unstake this Node?</Text>}
        <RoundCornerButton
          disabled={isUnstaking}
          style={styles.button}
          title={isUnstaking ? 'Unstaking in process' : 'Unstake'}
          isAsync={isUnstaking}
          isLoading={isUnstaking}
          onPress={onUnstake}
        />
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

export default withLayout_2(Unstake);
