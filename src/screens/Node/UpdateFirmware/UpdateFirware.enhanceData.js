import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigationParam } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import { selectUserNodeToken } from '@screens/Node/Node.selector';

const enhance = WrappedComp => props => {
  const host      = useNavigationParam('host');

  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    accessToken,
    refreshToken
  } = useSelector(selectUserNodeToken);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          host,
          updating,
          updateSuccess,
          accessToken,
          refreshToken,

          setUpdating,
          setUpdateSuccess,
          error,
          setError,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;