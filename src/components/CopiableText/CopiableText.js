import { Text, TouchableOpacity } from '@src/components/core';
import clipboard from '@src/services/clipboard';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'react-native-elements';
import { generateTestId } from '@utils/misc';
import { COPYABLE_ADDRESS } from '@src/constants/elements';
import styleSheet from './style';

function handlePress(text, { copiedMessage }, onPress) {
  clipboard.set(text, { copiedMessage });
  if (onPress) {
    onPress();
  }
}

const CopiableText = ({
  text,
  style,
  children,
  textProps,
  containerProps,
  copiedMessage,
  showCopyIcon = true,
  oneLine = false,
  onPress,
}) => (
  <TouchableOpacity
    style={[styleSheet.textBox, style]}
    {...containerProps}
    onPress={() => handlePress(text, { copiedMessage }, onPress)}
  >
    {children || (
      <Text
        style={styleSheet.text}
        {...(oneLine ? { numberOfLines: 1, ellipsizeMode: 'middle' } : {})}
        {...textProps}
        {...generateTestId(COPYABLE_ADDRESS.ADDRESS)}
      >
        {text}
      </Text>
    )}
    {showCopyIcon && (
      <Icon type='material' name="content-copy" size={20} style={[styleSheet.copyIcon, oneLine ? { marginBottom: 10 } : {}]} color={COLORS.primary} {...generateTestId(COPYABLE_ADDRESS.CPY_ICO)} />
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
