import React from 'react';
import {Image, StyleSheet} from 'react-native';
import srcQuestionIcon from '@src/assets/images/icons/question.png';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

const QuestionIcon = props => {
  const {icon, style} = props;
  return (
    <Image
      source={icon ? icon : srcQuestionIcon}
      style={[styled.icon, style]}
    />
  );
};

QuestionIcon.defaultProps = {
  icon: '',
  style: null,
};

QuestionIcon.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.any,
};

export default QuestionIcon;
