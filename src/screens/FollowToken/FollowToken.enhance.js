import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { availableTokensSelector } from '@src/redux/selectors/shared';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { useSearchBox } from '@src/components/Header';
import { handleFilterTokenByKeySearch } from '@src/components/Token';
import uniqBy from 'lodash/uniqBy';
import withTokenSelect from '@src/components/TokenSelect/TokenSelect.enhance';
import {
  actionAddFollowToken,
  getBalance,
  actionRemoveFollowToken,
} from '@src/redux/actions/token';

const enhance = WrappedComp => props => {
  const tokens = useSelector(availableTokensSelector);
  const dispatch = useDispatch();
  const [result, keySearch] = useSearchBox({
    data: tokens,
    handleFilter: () => handleFilterTokenByKeySearch({ tokens, keySearch }),
  });
  const handleToggleFollowToken = async token => {
    try {
      if (!token?.isFollowed) {
        await dispatch(actionAddFollowToken(token?.tokenId));
      } else {
        await dispatch(actionRemoveFollowToken(token?.tokenId));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(getBalance({ ...token, id: token?.tokenId }));
    }
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
  withTokenSelect,
  withLayout_2,
  enhance,
);
