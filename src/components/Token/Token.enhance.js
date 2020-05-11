import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { selectedPrivacySeleclor, sharedSeleclor } from '@src/redux/selectors';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const enhance = WrappedComp => props => {
  const { tokenId } = props;
  const token = useSelector(selectedPrivacySeleclor.getPrivacyDataByTokenID)(
    tokenId,
  );
  const isGettingBalance = useSelector(
    sharedSeleclor.isGettingBalance,
  ).includes(tokenId);
  if (!token || !tokenId) {
    return null;
  }
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          ...token,
          isGettingBalance,
        }}
      />
    </ErrorBoundary>
  );
};

enhance.propTypes = {
  tokenId: PropTypes.number.isRequired,
};

export default enhance;
