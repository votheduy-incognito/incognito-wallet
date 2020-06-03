import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import IconOpenUrl from '@src/components/Icons/icon.openUrl';

const styled = StyleSheet.create({});

const BtnOpenUrl = props => {
  return (
    <TouchableOpacity {...props}>
      <IconOpenUrl />
    </TouchableOpacity>
  );
};

BtnOpenUrl.propTypes = {};

export default BtnOpenUrl;
