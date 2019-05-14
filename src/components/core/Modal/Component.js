import React from 'react';
import PropTypes from 'prop-types';
import { Modal as RNComponent } from 'react-native';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import { View, TouchableOpacity } from '../';
import styleSheet from './style';

const Modal = ({ children, close, containerStyle, closeBtnColor, ...otherProps }) => (
  <RNComponent animationType='fade' {...otherProps}>
    <View style={[styleSheet.container, containerStyle]}>
      {
        close && (
          <View style={styleSheet.header}>
            <TouchableOpacity onPress={close} style={styleSheet.closeBtn}>
              <MdIcons name='close' size={30} color={closeBtnColor} />
            </TouchableOpacity>
          </View>
        )
      }
      
      {children}
    </View>
  </RNComponent>
);

Modal.propTypes = {
  children: PropTypes.node,
  close: PropTypes.func,
  containerStyle: PropTypes.object,
  closeBtnColor: PropTypes.string
};

export default Modal;