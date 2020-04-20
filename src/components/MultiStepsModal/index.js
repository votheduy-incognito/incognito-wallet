import React  from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
  Modal,
  Text,
} from '@src/components/core';
import Step from '@components/MultiStepsModal/Step';
import styleSheet from './style';

const MultiStepsModal = ({ onClose, visible, title, steps }) => (
  <View style={[styleSheet.container]}>
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      close={onClose}
      isShowHeader={false}
    >
      <TouchableOpacity
        onPress={onClose}
        style={styleSheet.contentContainer}
      >
        <View style={styleSheet.content}>
          <Text>{title}</Text>
          {steps.map((step, index) =>
            <Step key={step.action} {...step} lastStep={index === steps.length - 1} />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  </View>
);

MultiStepsModal.defaultProps = {
};

MultiStepsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  steps: PropTypes.array.isRequired,
};

export default MultiStepsModal;
