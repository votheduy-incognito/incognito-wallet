import PropTypes from 'prop-types';
import {Button, Text} from '@components/core';
import React from 'react';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import styles from './styles';

const WelcomeSetupNode = React.memo(({ visible, onClose })=>{
  return (
    <Dialog
      width={0.8}
      height={220}
      visible={visible}
    >
      <DialogContent style={styles.dialog_container}>
        <Text style={styles.dialog_title_text}>
          Welcome to the Network!
        </Text>
        <Text style={styles.dialog_content_text}>
          Your Node will earn in cycles. Your first earnings will appear within two weeks.
        </Text>
        <Button
          onPress={onClose}
          title="OK"
        />
      </DialogContent>
    </Dialog>
  );
});

WelcomeSetupNode.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WelcomeSetupNode;
