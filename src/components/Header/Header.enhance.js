import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';

const enhance = WrappedComp => props => {
  const { canSearch } = props;
  const [state, setState] = React.useState({
    toggleSearch: false,
  });
  const { toggleSearch } = state;
  const onHandleSearch = async () => {
    if (canSearch) {
      await setState({
        ...state,
        toggleSearch: true,
      });
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, onHandleSearch, toggleSearch }} />
    </ErrorBoundary>
  );
};

export default enhance;
