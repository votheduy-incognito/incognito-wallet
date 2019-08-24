import {
  Container,
  Text,
  View,
  ActivityIndicator,
  Button
} from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import style from './style';

const GetStarted = ({ isInitialing, errorMsg, onRetry }) => {
  return (
    <Container style={style.container}>
      <View style={style.getStartedBlock}>
        <Text style={[style.title, style.centerText]}>Opening your wallet</Text>
        { isInitialing && <ActivityIndicator size={40} /> }
        { errorMsg && <Text style={[style.errorMsg, style.centerText]}>{errorMsg}</Text> }
        <Button style={style.retryBtn} title='Retry' onPress={onRetry} />
      </View>
    </Container>
  );
};

GetStarted.defaultProps = {
  errorMsg: null,
  isInitialing: true,
  onRetry: null
};

GetStarted.propTypes = {
  errorMsg: PropTypes.string,
  isInitialing: PropTypes.bool,
  onRetry: PropTypes.func
};

export default GetStarted;
