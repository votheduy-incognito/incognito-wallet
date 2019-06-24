import BaseScreen from '@src/screens/BaseScreen';
import React from 'react';
import { View } from 'react-native';
import style from './style';
export const TAG = 'DetailDevice';

class DetailDevice extends BaseScreen {
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

DetailDevice.propTypes = {};

DetailDevice.defaultProps = {};
export default DetailDevice;
