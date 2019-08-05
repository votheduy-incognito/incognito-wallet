import { Container, ScrollView, Alert } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';
import React from 'react';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountList from './AccountList';
import ActionButtons from './ActionButtons';

class UserHeaderBoard extends React.Component {
  constructor(props) {
    super(props);

    this.actionBtns = this.getActionBtns(props);
  }

  getActionBtns = props => {
    const { navigation, handleDeleteWallet } = props;
    return [
      {
        label: 'Create Account',
        handlePress: () => navigation.navigate(ROUTE_NAMES.CreateAccount),
        icon: <MdIcons name="add" />
      },
      {
        label: 'Import Account',
        handlePress: () => navigation.navigate(ROUTE_NAMES.ImportAccount),
        icon: <MdIcons name="input" />
      },
      {
        label: 'Export Account',
        handlePress: () => navigation.navigate(ROUTE_NAMES.ExportAccount),
        icon: <MaterialCommunityIcons name="export" />
      },
      {
        label: 'Delete Wallet',
        handlePress: () => {
          Alert.alert(
            'Delete your wallet?',
            'Do you want to delete this wallet? Make sure you did backed up the wallet.',
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              { text: 'OK, delete it', onPress: handleDeleteWallet }
            ],
            { cancelable: false }
          );
        },
        icon: <MdIcons name="delete" />
      }
    ];
  };

  render() {
    const {
      accountList,
      handleSwitchAccount,
      defaultAccountName,
      isGettingBalance
    } = this.props;
    return (
      <ScrollView>
        <Container>
          <AccountList
            accounts={accountList}
            switchAccount={handleSwitchAccount}
            defaultAccountName={defaultAccountName}
            isGettingBalance={isGettingBalance}
          />
          <ActionButtons actionBtns={this.actionBtns} />
        </Container>
      </ScrollView>
    );
  }
}
UserHeaderBoard.defaultProps = {
  accountList: undefined,
  handleSwitchAccount: undefined,
  handleDeleteWallet: undefined,
  defaultAccountName: '',
  isGettingBalance: undefined
};
UserHeaderBoard.propTypes = {
  accountList: PropTypes.arrayOf(PropTypes.object),
  handleSwitchAccount: PropTypes.func,
  handleDeleteWallet: PropTypes.func, 
  defaultAccountName: PropTypes.string,
  isGettingBalance: PropTypes.arrayOf(PropTypes.string)
};

export default UserHeaderBoard;
