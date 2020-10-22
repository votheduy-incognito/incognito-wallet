import React, { memo, useCallback, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import withEvent from '@screens/Event/Event.enhance';
import { styled } from '@screens/Event/Event.styles';
import { WebView } from 'react-native-webview';
import SimpleInfo from '@components/SimpleInfo';
import PropTypes from 'prop-types';
import BottomBar from '@screens/Event/Components/BottomBar';

const Event = (props) => {
  const {
    url,
    hasError,
    loading,
    onLoad,
    onLoadError,
    onLoadEnd
  } = props;

  const refWebView = useRef(null);

  const onGoBack = useCallback(() => {
    refWebView?.current?.goBack();
  }, []);

  const onGoForward = useCallback( () => {
    refWebView?.current?.goForward();
  }, []);

  const onReload = useCallback(() => {
    refWebView?.current?.reload();
  }, []);

  if (hasError) {
    return (
      <SimpleInfo
        text={`We can not open "${url}". Please make sure you are using a correct pApp URL.`}
        type='warning'
      />
    );
  }

  return (
    <View style={styled.container}>
      <WebView
        ref={refWebView}
        style={styled.webview}
        source={{ uri: url }}
        allowsBackForwardNavigationGestures
        onLoad={onLoad}
        bounces
        cacheEnabled={false}
        cacheMode='LOAD_NO_CACHE'
        onError={onLoadError}
        onLoadEnd={onLoadEnd}
      />
      { loading && (
        <View style={styled.wrapperIndicator}>
          <ActivityIndicator size='large'/>
        </View>
      )}
      <BottomBar
        onGoBack={onGoBack}
        onGoForward={onGoForward}
        onReload={onReload}
      />
    </View>
  );
};

Event.propTypes = {
  url: PropTypes.string.isRequired,
  hasError: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onLoad: PropTypes.func.isRequired,
  onLoadError: PropTypes.func.isRequired,
  onLoadEnd: PropTypes.func.isRequired
};

export default withEvent(memo(Event));