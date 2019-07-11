import {
  Button,
  Container,
  Text,
  Toast,
  TouchableOpacity,
  View
} from '@src/components/core';
import { getErrorMessage, messageCode } from '@src/services/errorHandler';
import LoadingContainer from '@src/components/LoadingContainer';
import PropTypes from 'prop-types';
import React from 'react';
import style from './style';

const GetStarted = ({ onCreateNew, isInitialing }) => {
  const handleGetStarted = async () => {
    try {
      const wallet = await onCreateNew();
      Toast.showInfo('Your wallet was created!');

      return wallet;
    } catch (e) {
      Toast.showError(getErrorMessage(e, { defaultCode: messageCode.code.create_wallet_failed }));
    }
  };

  if (isInitialing) {
    return <LoadingContainer />;
  }

  return (
    <Container style={style.container}>
      <View style={style.getStartedBlock}>
        <Text style={[style.title, style.centerText]}>Excited?</Text>
        <Text style={[style.title, style.centerText]}>You should be</Text>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          style={style.getStartedBtn}
        />
      </View>
      <View style={style.importKeyBlock}>
        <Text style={style.centerText}>
          Import private key if you already have an account with us.
        </Text>
        <TouchableOpacity onPress={() => alert('Doing...doing...doing...')}>
          <Text style={[style.importBtn, style.centerText]}>
            Import your key
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

GetStarted.propTypes = {
  onCreateNew: PropTypes.func.isRequired,
  isInitialing: PropTypes.bool.isRequired
};

export default GetStarted;
