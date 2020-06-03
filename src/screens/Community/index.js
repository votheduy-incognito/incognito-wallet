import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationFocus } from 'react-navigation';
import { WebView } from 'react-native-webview';
import { Image } from 'react-native';
import { ActivityIndicator, TouchableOpacity, View } from '@components/core';
import { MAIN_WEBSITE } from '@src/constants/config';
import chevronLeft from '@assets/images/icons/chevron-left-icon.png';
import BackButton from '@src/components/BackButton';
import LogManager from '@src/services/LogManager';
import LocalDatabase from '@src/utils/LocalDatabase';
import { CircleBack } from '@src/components/Icons';
import NavigationService from '@src/services/NavigationService';
import styles from './style';

const Community = ({ navigation, isFocused }) => {
  const webViewRef = useRef();
  const [loading, setLoading] = useState(true);
  const [backable, setBackable] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (isFocused) {
      const { uri: _uri } = navigation?.state?.params || {};

      if (_uri) {
        webViewRef?.current?.injectJavaScript(`location.href = '${_uri}';`);
        navigation?.setParams({ uri: null });
      }
    }
    // Check if the cache is existing
    LocalDatabase.getUriWebviewCommunity()
      .then(val => {
        if (val) {
          setUrl(val);
        } else {
          setUrl(MAIN_WEBSITE);
        }
      })
      .catch(err => {
        setUrl(MAIN_WEBSITE);
      });
  }, []);


  const goBack = () => {
    webViewRef.current.goBack();
    if (backable) {
      setBackable(false);
    }
  };

  const stateHandler = (state) => {
    if (!state.url.includes(MAIN_WEBSITE)) {
      setBackable(state.canGoBack);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => NavigationService.goBack()} style={styles.customBackContainer}>
        <CircleBack />
      </TouchableOpacity>
      <WebView
        onLoadEnd={(data) => {
          setLoading(false);
        }}
        cacheEnabled
        cacheMode='LOAD_CACHE_ONLY'
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1"
        source={{ uri: url }}
        ref={webViewRef}
        onNavigationStateChange={stateHandler}
        injectedJavaScript={`
        (function() {
          function wrap(fn) {
            return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage('navigationStateChange');
              return res;
            }
          }
      
          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
            window.ReactNativeWebView.postMessage('navigationStateChange');
          });
        })();
      
        true;
      `}
        onMessage={async ({ nativeEvent: state }) => {
          if (state.data === 'navigationStateChange') {
            if (typeof state?.url === 'string') {
              await LocalDatabase.setUriWebviewCommunity(state?.url);
            }
          }
        }}
      />
      {loading && <ActivityIndicator style={styles.loading} />}
      {backable && (
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Image
            style={{
              height: 18,
              width: '100%',
            }}
            resizeMode="contain"
            resizeMethod="resize"
            source={chevronLeft}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

Community.propTypes = {
  navigation: PropTypes.object.isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Community);
