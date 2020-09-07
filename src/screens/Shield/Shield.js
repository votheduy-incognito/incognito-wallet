import React from 'react';
import { View } from 'react-native';
import Header from '@src/components/Header';
import { BtnQuestionDefault } from '@src/components/Button';
import PropTypes from 'prop-types';
import { TokenBasic as Token, ListToken } from '@src/components/Token';
import { KeyboardAwareScrollView } from '@src/components/core';
import { styled } from './Shield.styled';
import withShield from './Shield.enhance';

const Shield = (props) => {
  const {
    handleShield,
    handleWhyShield,
    tokensFactories,
    onToggleUnVerifiedTokens,
    toggleUnVerified,
  } = props;
  return (
    <View style={styled.container}>
      <Header
        title="Search coins"
        canSearch
        rightHeader={<BtnQuestionDefault onPress={handleWhyShield} />}
      />
      <KeyboardAwareScrollView>
        {tokensFactories.map((item, index) => (
          <ListToken
            {...item}
            toggleUnVerified={toggleUnVerified}
            onToggleUnVerifiedTokens={onToggleUnVerifiedTokens}
            renderItem={({ item }) => (
              <Token
                externalSymbol
                onPress={() => handleShield(item?.tokenId)}
                tokenId={item?.tokenId}
                symbol="externalSymbol"
                styledSymbol={styled.styledSymbol}
                styledName={styled.styledName}
                styledContainerName={styled.styledContainerName}
              />
            )}
            key={index}
          />
        ))}
      </KeyboardAwareScrollView>
    </View>
  );
};

Shield.propTypes = {
  handleWhyShield: PropTypes.func.isRequired,
  handleShield: PropTypes.func.isRequired,
  tokensFactories: PropTypes.array.isRequired,
  onToggleUnVerifiedTokens: PropTypes.func.isRequired,
  toggleUnVerified: PropTypes.bool.isRequired,
};

export default withShield(Shield);
