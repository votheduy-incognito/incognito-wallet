import React from 'react';
import { RefreshControl, View, StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { BottomBar, ScrollView } from '@src/components/core';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import AppMaintain from '@components/AppMaintain/index';
import { useSelector } from 'react-redux';
import { isIOS } from '@src/utils/platform';
import styles from './style';
import withHome from './Home.enhance';
import Category from './features/Category';
import { homeSelector } from './Home.selector';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Home = (props) => {
  const [onPress, isDisabled, message] = useFeatureConfig('app');
  const { getHomeConfiguration, categories, isFetching } = props?.homeProps;
  const { outdatedVersion, Link: link } = useSelector(homeSelector)?.appVersion;
  const onUpdateApp = async () => {
    try {
      const APP_STORE_LINK =
        'itms://itunes.apple.com/us/app/apple-store/id1475631606?mt=8';
      const PLAY_STORE_LINK = 'market://details?id=com.incognito.wallet';
      const url = isIOS() ? APP_STORE_LINK : PLAY_STORE_LINK;

      const canOpenURL = await Linking.canOpenURL(url);
      if (canOpenURL) {
        Linking.openURL(url);
      } else {
        throw new Error();
      }
    } catch (error) {
      Linking.openURL(link);
    }
  };
  if (isDisabled) {
    return <AppMaintain message={message} />;
  }
  return (
    <View style={styled.container}>
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
      {outdatedVersion && (
        <BottomBar
          text="Update your app to get full functionality"
          onPress={onUpdateApp}
        />
      )}
    </View>
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
