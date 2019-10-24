import React, { PureComponent } from 'react';
import { Container } from '@src/components/core';

import Dapps from './Dapps';

class DappsContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Dapps
          {...this.props}
        />
      </Container>
    );
  }
}

export default DappsContainer;