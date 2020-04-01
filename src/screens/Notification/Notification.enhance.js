import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import LoadingContainer from '@src/components/LoadingContainer';
import {compose} from 'recompose';
import {withHeader} from '@src/components/Hoc';
import {ReadAllIcon} from '@src/components/Icons';
import ErrorBoundary from '@src/components/ErrorBoundary/ErrorBoundary';
import {notificationSelector} from './Notification.selector';
import {
  actionFetch,
  actionLoadmore,
  actionRefresh,
} from './Notification.actions';
import Empty from './Notification.empty';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const {isFetching, isFetched, data, isRefresh} = useSelector(
    notificationSelector,
  );
  const {page, over, list} = data;
  const navigationOptions = {
    title: 'Notification',
    headerRight: <ReadAllIcon />,
  };
  const showActivityIndicator = isFetching && page !== 0;
  const handleLoadmore = async () => {
    if (!over) {
      await dispatch(actionLoadmore());
      await dispatch(
        actionFetch({
          loadmore: true,
        }),
      );
    }
  };
  const onRefresh = async () => {
    if (!isRefresh) {
      await dispatch(actionRefresh());
      await dispatch(actionFetch());
    }
  };

  if (!isFetched) {
    return <LoadingContainer />;
  }
  if (list.length === 0) {
    return <Empty />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleLoadmore,
          navigationOptions,
          list,
          showActivityIndicator,
          refreshing: isRefresh,
          onRefresh,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(withHeader, enhance);
