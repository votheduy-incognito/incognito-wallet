import React from 'react';
import {Image} from 'react-native';
import srcQuestionIcon from '@src/assets/images/icons/question.png';
import PropTypes from 'prop-types';

const QuestionIcon = props => {
  const {icon} = props;
  return (
    <Image
      source={icon ? icon : srcQuestionIcon}
      style={{
        width: 24,
        height: 24,
      }}
    />
  );
};

QuestionIcon.defaultProps = {
  icon: '',
};

QuestionIcon.propTypes = {
  icon: PropTypes.string,
};

export default QuestionIcon;
