import BaseScreen from '@src/screens/BaseScreen';
import React from 'react';
import { View } from 'react-native';
import style from './style';

export const TAG = 'ConfigDevice';

class ConfigDevice extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUpdate(nextProps) {
    console.log(
      `${TAG} - componentWillUpdate - nextProps = ${JSON.stringify(nextProps)} `
    );
  }

  render() {
    return <View style={style.container} />;
  }
}

ConfigDevice.propTypes = {};

ConfigDevice.defaultProps = {};
export default ConfigDevice;
