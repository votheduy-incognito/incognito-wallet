import React from 'react';
import { Image } from 'react-native';
import srcSquareQuestionIcon from '@src/assets/images/icons/square_question.png';

const SquareQuestionIcon = props => {
  const defaultStyle = {
    width: 41,
    height: 38,
  };
  const { style, source, ...rest } = props;
  return (
    <Image
      source={srcSquareQuestionIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default SquareQuestionIcon;
