import React from 'react';
import {Image} from 'react-native';
import srcEditIcon from '@src/assets/images/icons/edit.png';

const EditIcon = props => {
  const defaultStyle = {
    width: 20,
    height: 20,
  };
  const {style, source, ...rest} = props;
  return <Image source={srcEditIcon} style={[defaultStyle, style]} {...rest} />;
};

export default EditIcon;
