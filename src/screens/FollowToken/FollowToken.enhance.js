import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { availableTokensSelector } from '@src/redux/selectors/shared';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { useSearchBox } from '@src/components/Header';
import { handleFilterTokenByKeySearch } from '@src/components/Token';
import withTokenSelect from '@src/components/TokenSelect/TokenSelect.enhance';
import {
  actionAddFollowToken,
  actionRemoveFollowToken,
  actionToggleUnVerifiedToken,
} from '@src/redux/actions/token';
import { toggleUnVerifiedTokensSelector } from '@src/redux/selectors/token';

const enhance = (WrappedComp) => (props) => {
  const availableTokens = useSelector(availableTokensSelector);
  let verifiedTokens = [];
  let unVerifiedTokens = [];
  availableTokens.map((token) =>
    token?.isVerified
      ? verifiedTokens.push(token)
      : unVerifiedTokens.push(token),
  );
  const toggleUnVerified = useSelector(toggleUnVerifiedTokensSelector);
  const dispatch = useDispatch();
  const [_verifiedTokens, keySearch, handleFilterData] = useSearchBox({
    data: verifiedTokens,
    handleFilter: () =>
      handleFilterTokenByKeySearch({ tokens: verifiedTokens, keySearch }),
  });
  const [_unVerifiedTokens, _keySearch, _handleFilterData] = useSearchBox({
    data: unVerifiedTokens,
    handleFilter: () =>
      handleFilterTokenByKeySearch({
        tokens: unVerifiedTokens,
        keySearch: _keySearch,
      }),
  });
  const handleToggleFollowToken = async (token) => {
    try {
      if (!token?.isFollowed) {
        await dispatch(actionAddFollowToken(token?.tokenId));
      } else {
        await dispatch(actionRemoveFollowToken(token?.tokenId));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFilterTokensUnVerified = () =>
    dispatch(actionToggleUnVerifiedToken());

  React.useEffect(() => {
    const __verifiedTokens = handleFilterTokenByKeySearch({
      tokens: verifiedTokens,
      keySearch,
    });
    handleFilterData(__verifiedTokens);
    if (toggleUnVerified) {
      const __unVerifiedTokens = handleFilterTokenByKeySearch({
        tokens: unVerifiedTokens,
        keySearch: _keySearch,
      });
      _handleFilterData(__unVerifiedTokens);
    }
  }, [availableTokens]);

  const tokensFactories = [
    {
      isVerifiedTokens: true,
      data: _verifiedTokens,
      visible: true,
      styledListToken: { paddingTop: 27 },
    },
    {
      isVerifiedTokens: false,
      data: _unVerifiedTokens,
      visible: toggleUnVerified,
      styledListToken: { paddingTop: 15 },
    },
  ];
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          tokensFactories,
          handleToggleFollowToken,
          handleFilterTokensUnVerified,
          toggleUnVerified,
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
