import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { availableTokensSelector } from '@src/redux/selectors/shared';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { useSearchBox } from '@src/components/Header';
import { handleFilterTokenByKeySearch } from '@src/components/Token';
import {
  actionAddFollowToken,
  actionRemoveFollowToken,
} from '@src/redux/actions';
import uniqBy from 'lodash/uniqBy';

const enhance = WrappedComp => props => {
  const tokens = useSelector(availableTokensSelector);
  const dispatch = useDispatch();
  const [result, keySearch] = useSearchBox({
    data: tokens,
    handleFilter: () => handleFilterTokenByKeySearch({ tokens, keySearch }),
  });
  const handleToggleFollowToken = async token => {
    await dispatch(
      !token?.isFollowed
        ? actionAddFollowToken(token?.tokenId)
        : actionRemoveFollowToken(token?.tokenId),
    );
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          data: uniqBy([...result], 'tokenId'),
          handleToggleFollowToken,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
