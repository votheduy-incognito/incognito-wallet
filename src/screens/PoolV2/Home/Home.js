import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View } from '@components/core';
import TotalReward from '@screens/PoolV2/Home/TotalReward';
import { withLayout_2 } from '@components/Layout';
import Actions from '@screens/PoolV2/Home/Actions';
import CoinList from '@screens/PoolV2/Home/CoinList';
import withPoolData from '@screens/PoolV2/Home/data.enhance';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import { Header, LoadingContainer } from '@src/components/';
import withHistories from '@screens/PoolV2/Home/histories.enhance';
import withRetry from '@screens/PoolV2/Home/retry.enhance';
import styles from './style';

const Home = ({
  config,
  userData,
  withdrawable,
  totalRewards,
  displayClipTotalRewards,
  displayFullTotalRewards,
  histories,
  onLoad,
  loading,
  account,
  isLoadingHistories,
}) => {
  const renderContent = () => {
    if (!config || !userData) {
      return (
        <LoadingContainer />
      );
    }

    return (
      <View style={styles.wrapper}>
        <TotalReward
          total={displayClipTotalRewards}
        />
        <Actions
          buy={!withdrawable}
          coins={config.coins}
          data={userData}
          totalRewards={totalRewards}
          displayFullTotalRewards={displayFullTotalRewards}
        />
        <CoinList
          coins={config.coins}
          data={userData}
          withdrawable={withdrawable}
          histories={histories}
          onLoad={onLoad}
          loading={loading}
          account={account}
          isLoadingHistories={isLoadingHistories}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Provide" accountSelectable />
      {renderContent()}
    </View>
  );
};

Home.propTypes = {
  config: PropTypes.object,
  userData: PropTypes.array,
  withdrawable: PropTypes.bool.isRequired,
  displayFullTotalRewards: PropTypes.string.isRequired,
  displayClipTotalRewards: PropTypes.string.isRequired,
  totalRewards: PropTypes.number.isRequired,
  histories: PropTypes.array.isRequired,
  onLoad: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  account: PropTypes.object.isRequired,
  isLoadingHistories: PropTypes.bool.isRequired
};

Home.defaultProps = {
  config: null,
  userData: null,
};

export default compose(
  withLayout_2,
  withDefaultAccount,
  withHistories,
  withPoolData,
  withRetry,
)(Home);
