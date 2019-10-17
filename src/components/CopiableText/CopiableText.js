import { Text, TouchableOpacity } from '@src/components/core';
import clipboard from '@src/services/clipboard';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'react-native-elements';
import styleSheet from './style';


const CopiableText = ({
  text,
  style,
  children,
  textProps,
  containerProps,
  copiedMessage,
  showCopyIcon = true,
  oneLine = false,
  iconStyle
}) => (
  <TouchableOpacity
    style={[styleSheet.textBox, style]}
    {...containerProps}
    onPress={() => clipboard.set(text, { copiedMessage })}
  >
    {children || (
      <Text
        style={styleSheet.text}
        {...(oneLine ? { numberOfLines: 1, ellipsizeMode: 'middle' } : {})}
        {...textProps}
      >
        {text}
      </Text>
    )}
    {showCopyIcon && (
      <Icon type='material' name="content-copy" size={20} style={styleSheet.copyIcon} color={COLORS.primary} />
    )}
  </TouchableOpacity>
);
CopiableText.defaultProps = {
  text: '',
  textProps: undefined,
  containerProps: undefined,
  showCopyIcon: false,
  oneLine: false,
  children: undefined,
  style: undefined,
  copiedMessage: undefined
};
CopiableText.propTypes = {
  text: PropTypes.string,
  textProps: PropTypes.object,
  containerProps: PropTypes.object,
  showCopyIcon: PropTypes.bool,
  oneLine: PropTypes.bool,
  children: PropTypes.node,
  copiedMessage: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default CopiableText;
