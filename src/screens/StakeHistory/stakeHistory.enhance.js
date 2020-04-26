import React from 'react';
import {compose} from 'recompose';
import withHeader from '@src/components/Hoc/withHeader';
import {ExHandler} from '@src/services/exception';
import {useDispatch, useSelector} from 'react-redux';
import LoadingContainer from '@src/components/LoadingContainer';
import {
  stakeHistorySelector,
  dataStakeHistorySelector,
} from './stakeHistory.selector';
import {actionFetch, actionChangePage} from './stakeHistory.actions';
import Empty from './stakeHistory.empty';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const {isFetching, isFetched} = useSelector(stakeHistorySelector);
  const {page, items, over} = useSelector(dataStakeHistorySelector);
  const empty = items.length === 0;
  const refreshing = isFetching;
  const fetchData = async (params = {}) => {
    try {
      await dispatch(actionFetch(params));
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const onRefresh = () => fetchData({loadmore: false});
  const onLoadmore = async () => {
    try {
      if (over) {
        return;
      }
      await dispatch(actionChangePage(page + 1));
      await fetchData();
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    fetchData({loadmore: false});
  }, []);
  if (!isFetched) {
    return <LoadingContainer />;
  }
  if (empty) {
    return <Empty />;
  }
  return (
    <WrappedComp
      {...{...props, items, refreshing, onRefresh, onLoadmore, over}}
    />
  );
};

export default compose(
  withHeader,
  enhance,
);
