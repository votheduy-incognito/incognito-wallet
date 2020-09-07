import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { availableTokensSelector } from '@src/redux/selectors/shared';
import { useSearchBox } from '@src/components/Header';
import { handleFilterTokenByKeySearch } from '@src/components/Token';
import { toggleUnVerifiedTokensSelector } from '@src/redux/selectors/token';
import PropTypes from 'prop-types';

const enhance = (WrappedComp) => (props) => {
  const availableTokens =
    props?.availableTokens || useSelector(availableTokensSelector);
  let verifiedTokens = [];
  let unVerifiedTokens = [];
  availableTokens.map((token) =>
    token?.isVerified
      ? verifiedTokens.push(token)
      : unVerifiedTokens.push(token),
  );
  const toggleUnVerified = useSelector(toggleUnVerifiedTokensSelector);
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
          toggleUnVerified,
        }}
      />
    </ErrorBoundary>
  );
};

enhance.propTypes = {
  availableTokens: PropTypes.array.isRequired,
};

export default enhance;
