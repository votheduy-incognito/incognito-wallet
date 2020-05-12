import React from 'react';
import { Clipboard } from 'react-native';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import LoadingContainer from '@src/components/LoadingContainer';
import {
  shieldSelector,
  shieldDataSelector,
} from '@screens/Shield/Shield.selector';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { ExHandler } from '@src/services/exception';
import { Toast } from '@src/components/core';
import { actionFetch as fetchDataShield } from '@screens/Shield/Shield.actions';
import { selectedPrivacySeleclor } from '@src/redux/selectors';

const enhance = WrappedComp => props => {
  const { isFetching, isFetched } = useSelector(shieldSelector);
  const { address } = useSelector(shieldDataSelector);
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const hasError = !isFetched && !isFetching;
  const dispatch = useDispatch();
  const onCopyAddress = async () => {
    try {
      Clipboard.setString(address);
      Toast.showInfo('Copied');
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleShield = async () =>
    await dispatch(fetchDataShield({ tokenId: selectedPrivacy?.tokenId }));
  if (isFetching) {
    return <LoadingContainer />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, onCopyAddress, hasError, handleShield }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
