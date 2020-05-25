import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import stylesheet from './style';


const ExtraInfo = (props) => {
  const { left, right, style } = props;

  const LeftWrapper = typeof left === 'object' ? View : Text;
  const RightWrapper = typeof right === 'object' ? View : Text;

  return (
    <View style={stylesheet.wrapper}>
      <LeftWrapper style={[stylesheet.text, stylesheet.textLeft, style]}>{left}</LeftWrapper>
      <RightWrapper
        numberOfLines={1}
        ellipsizeMode='tail'
        style={[stylesheet.text, stylesheet.textRight, style]}
      >
        {right}
      </RightWrapper>
    </View>
  );
};

ExtraInfo.propTypes = {
  left: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  right: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  style: PropTypes.object,
};

ExtraInfo.defaultProps = {
  style: null,
};

export default ExtraInfo;
