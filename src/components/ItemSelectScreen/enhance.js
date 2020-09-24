import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import _ from 'lodash';
import { useNavigationParam } from 'react-navigation-hooks';

const enhance = WrappedComp => (props) => {
  const items = useNavigationParam('items') || [];
  const [displayItems, setDisplayItems] = React.useState(items);

  const handleSearch = text => {
    if (text) {
      const searchText = _.toLower(_.trim(text));
      const validItems = items.filter(item => _.toLower(item).includes(searchText));
      setDisplayItems(validItems);
    } else {
      setDisplayItems(items);
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onSearch: handleSearch,
          items: displayItems,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
