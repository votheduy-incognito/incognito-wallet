import {Modal, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    width: '100%',
    height: '100%',
  },
});

const PureModal = ({visible, content}) => (
  <Modal
    presentationStyle="overFullScreen"
    animationType="slide"
    visible={visible}
    transparent
  >
    <SafeAreaView style={styled.overlay}>{content}</SafeAreaView>
  </Modal>
);

PureModal.defaultProps = {
  content: () => null,
};

PureModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  content: PropTypes.element,
};

export default PureModal;
