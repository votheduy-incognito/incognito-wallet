import { Container, ScrollView, Alert } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';
import React from 'react';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import AccountList from './AccountList';
import ActionButtons from './ActionButtons';

class UserHeaderBoard extends React.Component {
  constructor(props) {
    super(props);

    this.actionBtns = this.getActionBtns(props);
  }

  getActionBtns = props => {
    const { navigation, handleDeleteWalle } = props;
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
              { text: 'OK, delete it', onPress: handleDeleteWalle }
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
  handleDeleteWalle: undefined,
  defaultAccountName: '',
  isGettingBalance: undefined
};
UserHeaderBoard.propTypes = {
  accountList: PropTypes.objectOf(PropTypes.array),
  handleSwitchAccount: PropTypes.func,
  handleDeleteWalle: PropTypes.func, 
  defaultAccountName: PropTypes.string,
  isGettingBalance: PropTypes.objectOf(PropTypes.array)
};

export default UserHeaderBoard;
