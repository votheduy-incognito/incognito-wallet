import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TouchableOpacity,
} from '@src/components/core';
import { Overlay } from 'react-native-elements';
import { MESSAGES } from '@screens/Dex/constants';
import style from './style';

const ModeSelectorModal = ({ isVisible, onSelect, currentMode, onClose }) => (
  <Overlay
    isVisible={isVisible}
    overlayStyle={[style.dialog]}
    onBackdropPress={onClose}
  >
    <View style={style.dialogContent}>
      <TouchableOpacity style={[style.mode, currentMode === MESSAGES.ADD_LIQUIDITY && style.active]} onPress={() => onSelect(MESSAGES.ADD_LIQUIDITY)}>
        <Text style={currentMode === MESSAGES.ADD_LIQUIDITY && style.activeText}>Add liquidity</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[style.mode, currentMode === MESSAGES.REMOVE_LIQUIDITY && style.active]} onPress={() => onSelect(MESSAGES.REMOVE_LIQUIDITY)}>
        <Text style={currentMode === MESSAGES.REMOVE_LIQUIDITY && style.activeText}>Remove liquidity</Text>
      </TouchableOpacity>
    </View>
  </Overlay>
);

ModeSelectorModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  currentMode: PropTypes.string.isRequired,
};

export default ModeSelectorModal;
