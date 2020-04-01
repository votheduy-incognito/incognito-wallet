import React from 'react';
import {ReadIcon} from '@src/components/Icons';
import {COLORS} from '@src/styles';
import {StyleSheet} from 'react-native';
import Button from './Button';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGrey1,
  },
});

const BtnRead = props => {
  return (
    <Button
      {...{
        ...props,
        icon: <ReadIcon />,
        title: 'Mark read',
        styledContainer: styled.container,
      }}
    />
  );
};

export default BtnRead;
