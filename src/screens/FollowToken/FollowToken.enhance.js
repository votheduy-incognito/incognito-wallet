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
  actionRemoveFollowToken,
} from '@src/redux/actions/token';

const enhance = (WrappedComp) => (props) => {
  const tokens = useSelector(availableTokensSelector);
  const [state, setState] = React.useState({
    data: [],
  });
  const { data } = state;
  const dispatch = useDispatch();
  const [result, keySearch] = useSearchBox({
    data,
    handleFilter: () => handleFilterTokenByKeySearch({ tokens, keySearch }),
  });
  const handleToggleFollowToken = async (token) => {
    try {
      if (!token?.isFollowed) {
        dispatch(actionAddFollowToken(token?.tokenId));
      } else {
        dispatch(actionRemoveFollowToken(token?.tokenId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterTokensVerified = (checked) => {
    let _tokens = [];
    try {
      _tokens = checked ? tokens.filter((token) => token?.isVerified) : tokens;
    } catch (error) {
      console.debug(error);
    } finally {
      setState({ ...state, data: _tokens });
    }
  };

  React.useEffect(() => {
    setState({ ...state, data: tokens });
  }, [tokens]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          data: uniqBy([...result], 'tokenId'),
          handleToggleFollowToken,
          handleFilterTokensVerified,
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
