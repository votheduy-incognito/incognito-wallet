import React from 'react';
import { DeleteIcon } from '@src/components/Icons';
import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';
import Button from './Button';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const BtnDelete = ({ showIcon = true, ...rest }) => (
  <Button
    {...{
      ...rest,
      icon: showIcon ? <DeleteIcon /> : null,
      title: 'Remove',
      styledContainer: styled.container,
    }}
  />
);

export default BtnDelete;
