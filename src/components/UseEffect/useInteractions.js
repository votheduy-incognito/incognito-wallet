import React, { PureComponent } from 'react';
import { InteractionManager } from 'react-native';

export default (WrappedComponent) =>
  class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        hidden: true,
      };
    }
    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ hidden: false });
      });
    }
    render() {
      const { hidden } = this.state;
      if (hidden) {
        return null;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
