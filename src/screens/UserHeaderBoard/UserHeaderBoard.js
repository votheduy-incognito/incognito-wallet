import React from 'react';
import { Container, Text } from '@src/components/core';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import { logout } from '@src/services/auth';
import ActionButtons from './ActionButtons';
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
        handlePress: null,
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
    return (
      <Container>
        <Text>User Board</Text>
        <ActionButtons actionBtns={this.actionBtns} />
      </Container>
    );
  }
}

export default UserHeaderBoard;