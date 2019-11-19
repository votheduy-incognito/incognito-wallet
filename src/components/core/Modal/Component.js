import PropTypes from 'prop-types';
import React from 'react';
import { Modal as RNComponent,SafeAreaView, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity, View } from '..';
import styleSheet from './style';

const Modal = ({
  children,
  close,
  headerText,
  transparent,
  containerStyle,
  closeBtnColor,
  isShowHeader,
  ...otherProps
}) => (
  <RNComponent transparent={transparent} animationType="fade" {...otherProps}>
    <SafeAreaView style={[styleSheet.containerSafeView, transparent && { backgroundColor: 'transparent' }]}>
      <View style={[styleSheet.container, containerStyle]}>
        {isShowHeader && (close || headerText) && (
          <View style={styleSheet.header}>
            <Text style={styleSheet.headerText} numberOfLines={1} ellipsizeMode='tail'>{headerText}</Text>
            <TouchableOpacity onPress={close} style={styleSheet.closeBtn}>
              <Icon name='close' type='material' size={30} color={closeBtnColor} />
            </TouchableOpacity>
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
  closeBtnColor: 'white',
  isShowHeader: true,
  transparent: false,
  headerText: null
};

Modal.propTypes = {
  children: PropTypes.node,
  close: PropTypes.func,
  containerStyle: PropTypes.object,
  closeBtnColor: PropTypes.string,
  isShowHeader: PropTypes.bool,
  transparent: PropTypes.bool,
  headerText: PropTypes.string,
};

export default Modal;
