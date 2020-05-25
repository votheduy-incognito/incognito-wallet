import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import _ from 'lodash';
import { useNavigationParam } from 'react-navigation-hooks';

const enhance = WrappedComp => (props) => {
  const tokens = useNavigationParam('tokens') || [];
  const [displayTokens, setDisplayTokens] = React.useState(tokens);

  const handleSearch = text => {
    if (text) {
      const searchText = _.toLower(_.trim(text));
      const validTokens = _.uniqBy(tokens, 'id').filter(
        item =>
          _.toLower(item.name).includes(searchText) ||
          _.toLower(item.symbol).includes(searchText),
      );

      setDisplayTokens(validTokens);
    } else {
      setDisplayTokens(tokens);
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onSearch: handleSearch,
          tokens: displayTokens,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
