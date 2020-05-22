import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { UTILS } from '@src/styles';
import PropTypes from 'prop-types';
import { Name, Symbol } from './Token';
import withToken from './Token.enhance';
import { styled } from './Token.styled';

const _styled = StyleSheet.create({
  styledName: {
    maxWidth: UTILS.screenWidth() / 2,
  },
});

const TokenShield = props => {
  const { onPress, style } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styled.container, style]}>
        <View style={[styled.extra]}>
          <Name styledName={_styled.styledName} />
        </View>
        <View style={styled.extra}>
          <Symbol />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

TokenShield.defaultProps = {
  style: null,
};
TokenShield.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
};

export default withToken(React.memo(TokenShield));
