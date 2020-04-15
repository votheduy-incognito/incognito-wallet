import React from 'react';
import {compose} from 'recompose';
import withHeader from '@src/components/Hoc/withHeader';
import {ExHandler} from '@src/services/exception';
import {useDispatch, useSelector} from 'react-redux';
import LoadingContainer from '@src/components/LoadingContainer';
import {actionFetch} from './stake.actions';
import {stakeSelector} from './stake.selector';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const {isFetched} = useSelector(stakeSelector);
  const fetchData = async () => {
    try {
      await dispatch(actionFetch());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  if (!isFetched) {
    return <LoadingContainer />;
  }
  return <WrappedComp {...{...props, fetchData}} />;
};

export default compose(
  withHeader,
  enhance,
);
