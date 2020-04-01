import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    const {hasError} = this.state;
    const {children} = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <View>
          <Text>Something went wrong.</Text>
        </View>
      );
    }
    return children;
  }
}

ErrorBoundary.propsTypes = {
  children: PropTypes.any.isRequired,
};

export default ErrorBoundary;
