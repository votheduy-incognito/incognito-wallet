import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { UTILS } from '@src/styles';
import PropTypes from 'prop-types';
import { TokenContext, Name, Symbol } from './Token';
import withToken from './Token.enhance';
import { styled } from './Token.styled';

const _styled = StyleSheet.create({
  styledDisplayName: {
    maxWidth: UTILS.screenWidth() / 2,
  },
});

const TokenShield = props => {
  const { onPress, style } = props;
  return (
    <TokenContext.Provider
      value={{
        tokenProps: props,
      }}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styled.container, style]}>
          <View style={styled.extra}>
            <Name styledDisplayName={_styled.styledDisplayName} />
          </View>
          <View style={styled.extra}>
            <Symbol />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </TokenContext.Provider>
  );
};

TokenShield.defaultProps = {
  style: null,
};
TokenShield.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default withToken(TokenShield);
