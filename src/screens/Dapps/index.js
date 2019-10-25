import React, { PureComponent } from 'react';

import Dapps from './Dapps';

class DappsContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dapps
        {...this.props}
      />
    );
  }
}

export default DappsContainer;