import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import HelpIcon from '@components/HelpScreen/Icon';
import ROUTE_NAMES from '@routers/routeNames';
import { Row } from '@src/components/';
import styles from './style';

const TotalReward = ({
  total,
}) => {
  return (
    <View>
      <Row center style={styles.rewards}>
        <Text style={styles.amount}>
          <Text style={styles.symbol}>{CONSTANT_COMMONS.PRV_SPECIAL_SYMBOL}</Text>&nbsp;
          {total}
        </Text>
      </Row>
      <Row center>
        <Text style={[styles.center, styles.rateStyle]}>Provider Rewards</Text>
        <HelpIcon screen={ROUTE_NAMES.PoolV2Help} style={styles.icon} />
      </Row>
    </View>
  );
};

TotalReward.propTypes = {
  total: PropTypes.string.isRequired,
};

export default React.memo(TotalReward);
