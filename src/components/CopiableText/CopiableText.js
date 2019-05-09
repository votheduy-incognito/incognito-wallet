import React from 'react';
import PropTypes from 'prop-types';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import { Text, TouchableOpacity } from '@src/components/core';
import clipboard from '@src/services/clipboard';
import styleSheet from './style';

const CopiableText = ({ text, textProps, containerProps, showCopyIcon = true, oneLine = false }) => (
  <TouchableOpacity style={styleSheet.textBox} {...containerProps} onPress={() => clipboard.set(text)} >
    <Text style={styleSheet.text} {...oneLine ? { numberOfLines: 1, ellipsizeMode: 'middle' } : {}} {...textProps} >{text}</Text>
    { showCopyIcon && <MdIcons name='content-copy' size={20} style={styleSheet.copyIcon} />}
  </TouchableOpacity>
);

CopiableText.propTypes = {
  text: PropTypes.string,
  textProps: PropTypes.object,
  containerProps: PropTypes.object,
  showCopyIcon: PropTypes.bool,
  oneLine: PropTypes.bool
};

export default CopiableText;