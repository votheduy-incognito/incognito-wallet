import { Alert, Button, Container, Toast } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styleSheet from './style';

class AccountDetail extends Component {
  handleRemove = async () => {
    try {
      const { removeAccount, account } = this.props;
      await removeAccount(account);
      Toast.showInfo('Remove completed');
    } catch {
      Toast.showError('Remove failed');
    }
  };

  handleRemoveConfirm = () => {
    const { account } = this.props;
    Alert.alert(
      'Confirm',
      `Remove account "${account?.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { text: 'OK', onPress: this.handleRemove }
      ],
      { cancelable: false }
    );
  };

  handleExportKey = () => {
    const { navigation, account } = this.props;
    navigation.navigate(ROUTE_NAMES.ExportAccount, { account });
  };

  render() {
    return (
      <Container>
        <Button
          title="EXPORT KEY"
          style={styleSheet.exportBtn}
          onPress={this.handleExportKey}
        />
        <Button
          title="Remove Account"
          type="danger"
          style={styleSheet.removeBtn}
          titleStyle={styleSheet.removeBtnText}
          onPress={this.handleRemoveConfirm}
        />
      </Container>
    );
  }
}
AccountDetail.defaultProps = {
  account: undefined,
  navigation: undefined,
  removeAccount: undefined
};

AccountDetail.propTypes = {
  account: PropTypes.objectOf(PropTypes.object),
  navigation: PropTypes.objectOf(PropTypes.object),
  removeAccount: PropTypes.func
};

export default AccountDetail;
