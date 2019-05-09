import React from 'react';
import { Container, ActivityIndicator, } from '@src/components/core';
import styleSheet from './style';

const LoadingContainer = () => (
  <Container style={styleSheet.container}>
    <ActivityIndicator size={35} />
  </Container>
);

export default LoadingContainer;