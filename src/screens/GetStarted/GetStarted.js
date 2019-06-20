import React from 'react';
import PropTypes from 'prop-types';
import { View, Button, Toast } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';

const GetStarted = ({ onCreateNew, goHome, isInitialing }) => {
  const handleGetStarted = async () => {
    try {
      const wallet = await onCreateNew();
      Toast.showInfo('Your wallet was created!');
      goHome();

      return wallet;
    } catch {
      Toast.showError('Can not create your wallet, please try again');
    }
  };

  if (isInitialing) {
    return <LoadingContainer />;
  }

  return (
    <View>
      <Button title='Get Started' onPress={handleGetStarted} />
    </View>
  );
};

GetStarted.propTypes = {
  onCreateNew: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
  isInitialing: PropTypes.bool.isRequired
};

export default GetStarted;