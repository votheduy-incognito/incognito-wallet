import React, { useCallback, useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigationParam } from 'react-navigation-hooks';
import Header from '@components/Header';

const enhance = WrappedComp => props => {

  const { url: navUrl, title }  = useNavigationParam('data');
  const [url, setUrl]           = useState(navUrl);
  const [loading, setLoading]   = useState(true);
  const [hasError, setHasError] = useState(false);

  /* Start loading */
  const onLoad = useCallback((event) => {
    setLoading(true);
    setHasError(false);
    setUrl(event.nativeEvent.url);
  }, []);

  /* onLoad with Error */
  const onLoadError = useCallback(() => {
    setLoading(false);
    setHasError(true);
  }, []);

  /* End Loading */
  const onLoadEnd = useCallback(() => {
    setLoading(false);
    setHasError(false);
  }, []);

  return (
    <ErrorBoundary>
      <Header
        style={{ marginHorizontal: 25 }}
        title={title}
      />
      <WrappedComp
        {...{
          ...props,
          title,
          url,
          hasError,
          loading,
          onLoad,
          onLoadError,
          onLoadEnd
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;