import React, { useRef, useState } from 'react';
import {WebView} from 'react-native-webview';
import {Image} from 'react-native';
import {ActivityIndicator, TouchableOpacity, View} from '@components/core';
import { MAIN_WEBSITE } from '@src/constants/config';
import chevronLeft from '@assets/images/icons/chevron-left-icon.png';
import styles from './style';

const Community = () => {
  const webViewRef = useRef();
  const [loading, setLoading] = useState(true);
  const [backable, setBackable] = useState(false);

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
      <WebView
        onLoadEnd={() => setLoading(false)}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1"
        source={{ uri: MAIN_WEBSITE }}
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
        onMessage={({ nativeEvent: state }) => {
          if (state.data === 'navigationStateChange') {
            // To display navigation bar at the bottom
          }
        }}
      />
      { loading && <ActivityIndicator style={styles.loading} />}
      { backable && (
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

export default Community;
