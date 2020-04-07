import React from 'react';
import { QuestionIcon } from '@src/components/Icons';
import { StyleSheet } from 'react-native';
import Button from './Button';

const styled = StyleSheet.create({
  container: {
    padding: 20,
    paddingLeft: 0
  },
});

const BtnQuestion = props => (
  <Button
    {...{
      ...props,
      icon: <QuestionIcon />,
      hiddenTitle: true,
      styledContainer: styled.container,
    }}
  />
);

export default BtnQuestion;
