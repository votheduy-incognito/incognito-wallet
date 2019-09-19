import { ActivityIndicator, Text, View } from '@src/components/core';
import { COLORS } from '@src/styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import styleSheet from './style';

class Index extends Component {
  render() {
    const { text } = this.props;

    return (
      <Modal animationType="fade" transparent visible={!!text}>
        <View style={styleSheet.container}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styleSheet.desc, styleSheet.extraDesc]}>
            {text}
          </Text>
          <Text style={styleSheet.desc}>
            Please wait, this window will close when complete
          </Text>
        </View>
      </Modal>
    );
  }
}

Index.defaultProps = {
  text: '',
};

Index.propTypes = {
  text: PropTypes.string,
};

export default Index;
