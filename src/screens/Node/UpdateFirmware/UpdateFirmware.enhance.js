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

const enhance = WrappedComp => props => {

  const navigation = useNavigation();

  const {
    host,
    onReload,
    updateSuccess,
    accessToken,
    refreshToken,
    setUpdating,
    setUpdateSuccess
  } = props;

  const onGoBack = () => {
    // If update firmware success, refresh NodeItem
    if (updateSuccess) {
      onReload && onReload();
    }
    navigation.goBack();
  };

  const onUpdate = () => {
    try {
      if (!isEmpty(host) && !isEmpty(accessToken) && !isEmpty(refreshToken)) {
        // Start update FIRMWARE
        setUpdating(true);
      }
      const SSH = new SSHClient(host, 22, NODE_USER_NAME, NODE_PASSWORD,async (error) => {
        if (error) {
          // Cant Connect SSH NODE IP
          console.debug('CONNECT TO SSH FAIL: ', host);
          return;
        }
        console.debug('CONNECT TO SSH SUCCESS: ', host);
        const command = SSHCommandUpdateNode(accessToken, refreshToken);
        SSH.execute(command, (error, output) => {
          if (error) {
            console.log('WRITE SSH ERROR: ', error, command);
            // SSH.disconnect();
            return;
          }
          console.log('WRITE SSH SUCCESS WITH OUTPUT: ', output);

          // Update Firmware Success
          setUpdateSuccess(true);
          // SSH.disconnect();
        });
      });
    } catch (e) {
      // Update FIRMWARE have error
      console.debug('UPDATE FIRMWARE NODE BY SSH FAIL: ', host);
      setUpdating(false);
    } finally {
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