import React, { Component } from 'react';
import { Container, ScrollView } from '@src/components/core';
import AddInternalToken from '@src/components/AddInternalToken';

class CreateToken extends Component {
  render() {
    return (
      <ScrollView>
        <Container>
          <AddInternalToken />
        </Container>
      </ScrollView>
      
    );
  }
}

export default CreateToken;
