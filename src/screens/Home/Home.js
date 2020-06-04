import React from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
  RefreshControl,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import withHome from './Home.enhance';
import Category from './features/Category';

const Home = props => {
  const {
    closeTooltip,
    getHomeConfiguration,
    categories,
    isFetching,
  } = props?.homeProps;
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={closeTooltip}>
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={isFetching}
            onRefresh={getHomeConfiguration}
          />
        )}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {categories.map(category => (
            <Category key={category?.id} {...{ ...category }} />
          ))}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
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
