import React from 'react';
import { View } from 'react-native';
import Header from '@src/components/Header';
import { BtnQuestionDefault } from '@src/components/Button';
import PropTypes from 'prop-types';
import { TokenBasic as Token, ListAllToken } from '@src/components/Token';
import { styled } from './Shield.styled';
import withShield from './Shield.enhance';

const Shield = (props) => {
  const { handleShield, handleWhyShield, ...rest } = props;
  return (
    <View style={styled.container}>
      <Header
        title="Search coins"
        canSearch
        rightHeader={<BtnQuestionDefault onPress={handleWhyShield} />}
      />
      <ListAllToken
        {...rest}
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
      />
    </View>
  );
};

Shield.propTypes = {
  handleWhyShield: PropTypes.func.isRequired,
  handleShield: PropTypes.func.isRequired,
  tokensFactories: PropTypes.array.isRequired,
};

export default withShield(Shield);
