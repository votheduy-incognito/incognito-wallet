import React from 'react';
import {Image} from 'react-native';
import srcMineIcon from '@src/assets/images/icons/mine_icon.png';

const MineIcon = props => {
  const defaultStyle = {
    width: 20,
    height: 20,
  };
  const {style, source, ...rest} = props;
  return <Image source={srcMineIcon} style={[defaultStyle, style]} {...rest} />;
};

export default MineIcon;
