
import React, { Component } from 'react';
import { Button, Container, Alert, Toast } from '@src/components/core';
import styleSheet from './style';

class AccountDetail extends Component {

  handleRemove = () => {
    try {
      Toast.showInfo('Remove completed');
    } catch {
      Toast.showError('Remove failed');
    }
  }

  handleRemoveConfirm = () => {
    Alert.alert(
      'Confirm',
      'Remove account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: this.handleRemove}
      ],
      {cancelable: false},
    );
  }

  handleExportKey = () => {
    Toast.showWarning('Comming soon');
  }
  
  render() {
    return (
      <Container>
        <Button title='EXPORT KEY' style={styleSheet.exportBtn} onPress={this.handleExportKey} />
        <Button
          title='Remove Account'
          type='danger'
          style={styleSheet.removeBtn}
          titleStyle={styleSheet.removeBtnText}
          onPress={this.handleRemoveConfirm} />
      </Container>
    );
  }
}

export default AccountDetail;