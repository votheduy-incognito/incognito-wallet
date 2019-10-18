import React from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableWithoutFeedback } from 'react-native';

export default class TouchableScale extends React.Component {
  constructor(...args) {
    super(...args);
    const props = this.props;

    this.onPressIn = this.onPressIn.bind(this);
    this.onPressOut = this.onPressOut.bind(this);
    this.scaleAnimation = new Animated.Value(props.defaultScale);
  }

  render() {
    const props = this.props;

    return (
      <TouchableWithoutFeedback
        {...props}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
      >
        <Animated.View
          style={[props.style, {
            transform: [
              {scale: this.scaleAnimation},
            ]},
          ]}
        >
          {props.children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  onPressIn() {
    const props = this.props;

    Animated.timing(
      this.scaleAnimation,
      {
        toValue: props.activeScale,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }

  onPressOut() {
    Animated.timing(
      this.scaleAnimation,
      {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }
}

TouchableScale.propTypes = {
  defaultScale: PropTypes.number,
  activeScale: PropTypes.number,
};

TouchableScale.defaultProps = {
  defaultScale: 1,
  activeScale: 0.97,
};
