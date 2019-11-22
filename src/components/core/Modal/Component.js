import PropTypes from 'prop-types';
import React from 'react';
import { Modal as RNComponent,SafeAreaView, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '@src/styles';
import { TouchableOpacity, View } from '..';
import styleSheet from './style';

const Modal = ({
  children,
  close,
  headerText,
  transparent,
  containerStyle,
  closeBtnColor,
  closeOnBack,
  isShowHeader,
  ...otherProps
}) => (
  <RNComponent transparent={transparent} animationType="fade" onRequestClose={closeOnBack && close} {...otherProps}>
    <SafeAreaView style={[styleSheet.containerSafeView, transparent && { backgroundColor: 'transparent' }]}>
      <View style={[styleSheet.container, containerStyle]}>
        {isShowHeader && (close || headerText) && (
          <View style={styleSheet.header}>
            <TouchableOpacity onPress={close} style={styleSheet.closeBtn}>
              <Icon name='close' type='material' size={30} color={closeBtnColor} />
            </TouchableOpacity>
            <Text style={styleSheet.headerText} numberOfLines={1} ellipsizeMode='tail'>{headerText}</Text>
          </View>
        )}
          
        {children}
      </View>
    </SafeAreaView>
  </RNComponent>
);

Modal.defaultProps = {
  children: null,
  close: null,
  containerStyle: null,
  closeBtnColor: COLORS.primary,
  isShowHeader: true,
  transparent: false,
  headerText: null,
  closeOnBack: true
};

Modal.propTypes = {
  children: PropTypes.node,
  close: PropTypes.func,
  containerStyle: PropTypes.object,
  closeBtnColor: PropTypes.string,
  isShowHeader: PropTypes.bool,
  transparent: PropTypes.bool,
  headerText: PropTypes.string,
  closeOnBack: PropTypes.bool
};

export default Modal;
