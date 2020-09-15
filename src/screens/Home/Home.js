import React from 'react';
import { RefreshControl, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from '@src/components/core';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import AppMaintain from '@components/AppMaintain/index';
import styles from './style';
import withHome from './Home.enhance';
import Category from './features/Category';

const Home = (props) => {
  const [onPress, isDisabled, message] = useFeatureConfig('app');
  const { getHomeConfiguration, categories, isFetching } = props?.homeProps;

  if (isDisabled) {
    return (
      <AppMaintain message={message} />
    );
  }

  return (
    <ScrollView
      refreshControl={(
        <RefreshControl
          refreshing={isFetching}
          onRefresh={getHomeConfiguration}
        />
      )}
    >
      <View style={styles.contentContainer}>
        {categories.map((category, index) => (
          <Category
            key={category?.id}
            {...{ ...category, firstChild: index === 0 }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

Home.propTypes = {
  homeProps: PropTypes.shape({
    getHomeConfiguration: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
  }).isRequired,
};

export default withHome(Home);
