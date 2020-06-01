import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Header from '@components/Header';
import { withLayout_2 } from '@components/Layout';
import { RefreshControl, ScrollView, View } from '@components/core';
import Trade from '@screens/DexV2/components/Trade';
import _ from 'lodash';
import LoadingContainer from '@components/LoadingContainer/index';
import withPairs from '@screens/DexV2/components/pdexPair.enhance';
import COLORS from '@src/styles/colors';
import styles from './style';

class Dex extends React.Component {
  renderTrade() {
    const {
      tokens,
      pairTokens,
      pairs,
      loading,
    } = this.props;

    return (
      <Trade
        pairs={pairs}
        tokens={tokens}
        pairTokens={pairTokens}
        isLoading={loading}
      />
    );
  }

  renderMode() {
    const { pairTokens, pairs, tokens } = this.props;

    if (_.isEmpty(tokens) || _.isEmpty(pairs) || _.isEmpty(pairTokens)) {
      return <LoadingContainer />;
    }

    return this.renderTrade();
  }

  renderContent() {
    return (
      <View style={styles.wrapper}>
        <Header title="pDEX" accountSelectable />
        {this.renderMode()}
      </View>
    );
  }

  render() {
    const { loading, onLoadPairs } = this.props;
    return (
      <ScrollView
        style={styles.wrapper}
        contentContainerStyle={styles.wrapper}
        refreshControl={(
          <RefreshControl
            refreshing={loading}
            onRefresh={onLoadPairs}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        )}
      >
        {this.renderContent()}
      </ScrollView>
    );
  }
}

Dex.propTypes = {
  tokens: PropTypes.array.isRequired,
  pairs: PropTypes.array.isRequired,
  pairTokens: PropTypes.array.isRequired,
  onLoadPairs: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default compose(
  withLayout_2,
  withPairs,
)(Dex);
