import React from 'react';
import {Image} from 'react-native';
import srcDeleteIcon from '@src/assets/images/icons/delete.png';

const DeleteIcon = props => {
  const defaultStyle = {
    width: 18,
    height: 18,
  };
  const {style, source, ...rest} = props;
  return (
    <Image source={srcDeleteIcon} style={[defaultStyle, style]} {...rest} />
  );
};

export default DeleteIcon;
