import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { COLORS } from '@src/styles';
import { ScrollView } from '@src/components/core';
import {screenHeight, screenWidth} from '../../constants';
import {NotificationType} from '../../../../models/game';

function NotificationDialog(props) {
  const { visible, onCancel, notifications } = props;

  return (
    <Dialog visible={visible} style={styles.dialog}>
      <View>
        <DialogContent style={styles.content}>
          <ScrollView style={styles.scrollView}>
            {notifications
              .map((notification) => (
                <View style={[styles.notification, notification.type === NotificationType.INCOME ? styles.sell : styles.buy]}>
                  <Text style={styles.buttonText}>{notification.message}</Text>
                </View>
              ))}
          </ScrollView>
        </DialogContent>
        <View style={[styles.center, styles.actions]}>
          <TouchableOpacity onPress={onCancel} style={[styles.center, styles.closeButton]}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 30,
    width: screenWidth,
    height: screenHeight - 80,
    backgroundColor: '#9AB7B8',
  },
  scrollView: {
    maxHeight: '95%',
  },
  closeButton: {
    width: 120,
    height: 32,
    backgroundColor: '#014E52',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    height: 80,
    padding: 30,
  },
  buttonText: {
    color: 'white'
  },
  notification: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  buy: {
    backgroundColor: COLORS.red,
  },
  sell: {
    backgroundColor: COLORS.green,
  },
});

NotificationDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirmPrice: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  cells: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number,
    token: PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.number,
      symbol: PropTypes.string,
    })
  })).isRequired,
  playerTokens: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired,
};

export default React.memo(NotificationDialog);
