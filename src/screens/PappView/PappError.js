import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimpleInfo from '@src/components/SimpleInfo';

class PappError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <SimpleInfo
          type='error'
          text='We can not open this dApp right now.'
        />
      );
    }

    return children;
  }
}

PappError.propTypes = {
  children: PropTypes.node.isRequired
};

export default PappError;