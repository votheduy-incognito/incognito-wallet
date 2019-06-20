import {
  Container,
  Form,
  FormSubmitButton,
  FormTextField,
  Text,
  Toast
} from '@src/components/core';
import { setBulkAccount } from '@src/redux/actions/account';
import { setWallet } from '@src/redux/actions/wallet';
import ROUTE_NAMES from '@src/router/routeNames';
import { savePassword } from '@src/services/wallet/passwordService';
import {
  initWallet,
  loadListAccount
} from '@src/services/wallet/WalletService';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import formValidate from './formValidate';
import styleSheet from './style';

const CreatePassword = ({ navigation, setWallet, setBulkAccount }) => {
  const goHome = () => {
    navigation.navigate(ROUTE_NAMES.RootApp);
  };

  const setWalletToStore = wallet => {
    setWallet(wallet);
  };

  const loadListAccountToStore = wallet => {
    loadListAccount(wallet).then(accounts => {
      setBulkAccount(accounts);
    });
  };

  const handleCreateWallet = async ({ password }) => {
    try {
      await savePassword(password);
      const wallet = await initWallet();

      setWalletToStore(wallet);
      loadListAccountToStore(wallet);

      Toast.showInfo('Your wallet was created!');
      goHome();
    } catch (e) {
      Toast.showError(e.message);
    }
  };

  return (
    <Container style={styleSheet.container}>
      <Text style={styleSheet.title}>Create Your Wallet</Text>
      <Text>The decentralized web awaits</Text>
      <Form
        onSubmit={handleCreateWallet}
        viewProps={{ style: styleSheet.form }}
        validationSchema={formValidate}
      >
        <FormTextField
          name="password"
          placeholder="Enter your password"
          textContentType="password"
          secureTextEntry
        />
        <FormSubmitButton title="Create" style={styleSheet.submitBtn} />
      </Form>
    </Container>
  );
};

CreatePassword.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.object),
  setWallet: PropTypes.func.isRequired,
  setBulkAccount: PropTypes.func.isRequired
};

const mapDispatch = { setWallet, setBulkAccount };

export default connect(
  null,
  mapDispatch
)(CreatePassword);
