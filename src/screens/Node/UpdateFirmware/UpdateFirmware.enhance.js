import React  from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { isEmpty } from 'lodash';
import SSHClient from 'react-native-ssh-sftp';
import {
  NODE_PASSWORD,
  NODE_USER_NAME
} from 'react-native-dotenv';
import {
  SSHCommandUpdateNode
} from '@screens/Node/Node.utils';
import { useNavigation } from 'react-navigation-hooks';
import { MESSAGES } from '@src/constants';
import routeNames from '@routers/routeNames';

const SECONDS = 1000;
const MINUTE  =  60 * SECONDS;

const enhance = WrappedComp => props => {

  const navigation = useNavigation();

  const {
    host,
    updateSuccess,
    accessToken,
    refreshToken,
    setUpdating,
    setUpdateSuccess,
    setError,
  } = props;

  const onGoBack = () => {
    // If update firmware success
    // Back to list node, refresh all
    if (updateSuccess) {
      navigation.navigate(routeNames.Node, {
        refresh: new Date().getTime()
      });
    }
    navigation.goBack();
  };

  const onUpdate = () => {
    try {
      if (!isEmpty(host) && !isEmpty(accessToken) && !isEmpty(refreshToken)) {
        // Start update FIRMWARE
        setUpdating(true);
      }
      const SSH = new SSHClient(host, 22, NODE_USER_NAME, NODE_PASSWORD, async (error) => {
        if (error) {
          // Cant Connect SSH NODE IP
          console.debug('CONNECT TO SSH FAIL: ', host);
          setUpdating(false);
          setError(MESSAGES.UPDATE_FIRMWARE_NODE_FAIL);
          return;
        }
        console.debug('CONNECT TO SSH SUCCESS: ', host);
        const command = SSHCommandUpdateNode(accessToken, refreshToken);
        SSH.execute(command, (error, output) => {
          if (error) {
            console.log('WRITE SSH ERROR: ', error, command);
            setUpdating(false);
            SSH.disconnect();
            setError(MESSAGES.UPDATE_FIRMWARE_NODE_FAIL);
            return;
          }
          console.log('WRITE SSH SUCCESS WITH OUTPUT: ', output);

          // Update Firmware Success
          setTimeout(() => {
            setUpdating(false);
            setUpdateSuccess(true);
            setError('');
            SSH.disconnect();
          }, MINUTE);
        });
      });
    } catch (e) {
      // Update FIRMWARE have error
      console.debug('UPDATE FIRMWARE NODE BY SSH FAIL: ', host);
      setUpdating(false);
    }
  };

  const onButtonPress = () => {
    updateSuccess ? onGoBack() : onUpdate();
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          onGoBack,
          onButtonPress,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;