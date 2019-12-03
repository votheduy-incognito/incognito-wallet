import React, { PureComponent } from 'react';

import Papps from './Papps';

class PappsContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Papps
        {...this.props}
      />
    );
  }
}

export default PappsContainer;