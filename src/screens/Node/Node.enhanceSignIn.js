import React, {useEffect, useState} from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import LocalDatabase from '@utils/LocalDatabase';
import { isEmpty } from 'lodash';
import {formatNodeAccount} from '@screens/Node/Node.builder';
import {useDispatch} from 'react-redux';
import {
  actionCheckAccessRefreshToken as checkAccessRefreshToken,
  actionUpdateListNodeDevice as updateListNodeDevice
} from '@screens/Node/Node.actions';
import {getNodeUserParams} from '@screens/Node/Node.utils';

const nodeSignInEnhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Update access_token & refresh_token
  const updateAccessTokenAndRefreshToken = (accessToken, refreshToken) => {
    dispatch(checkAccessRefreshToken(accessToken, refreshToken));
  };

  const onSignIn = async () => {
    const user = await LocalDatabase.getUserInfo();
    if (isEmpty(user)) {
      setLoading(true);
      const { status, data } = await getNodeUserParams();
      const { access_token, refresh_token } = data;
      updateAccessTokenAndRefreshToken(access_token, refresh_token);
      const listDevice = (status === 1 && await formatNodeAccount(data)) || [];
      setLoading(false);
      dispatch(updateListNodeDevice({ listDevice }));
    } else {
      updateAccessTokenAndRefreshToken();
    }
  };

  useEffect( () => {
    onSignIn().then();
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          loading
        }}
      />
    </ErrorBoundary>
  );
};

export default nodeSignInEnhance;
