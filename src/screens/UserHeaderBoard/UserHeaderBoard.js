import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView } from '@src/components/core';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import { logout } from '@src/services/auth';
import ActionButtons from './ActionButtons';
import AccountList from './AccountList';
import ROUTE_NAMES from '@src/router/routeNames';

class UserHeaderBoard extends React.Component {
  constructor(props) {
    super(props);

    this.actionBtns = this.getActionBtns(props);
  }

  getActionBtns = (props) => {
    const { navigation } = props;
    return ([
      {
        label: 'Create Account',
        handlePress: () => navigation.navigate(ROUTE_NAMES.CreateAccount),
        icon: <MdIcons name='add' />
      },
      {
        label: 'Import Account',
        handlePress: () => navigation.navigate(ROUTE_NAMES.ImportAccount),
        icon: <MdIcons name='input' />
      },
      {
        label: 'Log out',
        handlePress: () => logout({ navigation }),
        icon: <MdIcons name='exit-to-app' />
      }
    ]);
  }

  render() {
    const { accountList, handleSwitchAccount, defaultAccountName, isGettingBalance } = this.props;
    return (
      <ScrollView>
        <Container>
          <AccountList accounts={accountList} switchAccount={handleSwitchAccount} defaultAccountName={defaultAccountName} isGettingBalance={isGettingBalance} />
          <ActionButtons actionBtns={this.actionBtns} />
        </Container>
      </ScrollView>
    );
  }
}

UserHeaderBoard.propTypes = {
  accountList: PropTypes.array,
  handleSwitchAccount: PropTypes.func,
  defaultAccountName: PropTypes.string,
  isGettingBalance: PropTypes.array
};

export default UserHeaderBoard;