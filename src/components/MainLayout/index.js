import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, ScrollView, FlexView, LoadingContainer } from '@components/core';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import styles from './style';

const MainLayout = ({
  header,
  children,
  scrollable,
  loading,
}) => {
  return (
    <FlexView>
      <Header title={header} />
      {loading ? <LoadingContainer /> :
        scrollable ? (
          <ScrollView paddingBottom contentContainerStyle={[styles.content]}>
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content]}>
            {children}
          </View>
        )
      }
    </FlexView>
  );
};

MainLayout.propTypes = {
  header: PropTypes.string,
  children: PropTypes.any,
  scrollable: PropTypes.bool,
  loading: PropTypes.bool,
};

MainLayout.defaultProps = {
  header: '',
  children: null,
  scrollable: false,
  loading: false,
};

export default compose(
  withLayout_2,
)(MainLayout);
