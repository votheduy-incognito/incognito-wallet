import React from 'react';
import {Image} from 'react-native';
import srcQuestionIcon from '@src/assets/images/icons/question.png';

const QuestionIcon = () => {
  return (
    <Image
      source={srcQuestionIcon}
      style={{
        width: 24,
        height: 24,
      }}
    />
  );
};

export default QuestionIcon;
