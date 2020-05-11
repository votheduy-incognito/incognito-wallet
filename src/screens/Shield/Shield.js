import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '@src/components/Header';
import { BtnQuestionDefault } from '@src/components/Button';
import PropTypes from 'prop-types';
import { TokenShield as Token } from '@src/components/Token';
import { styled } from './Shield.styled';
import withShield from './Shield.enhance';

const Shield = props => {
  const { data, handleWhyShield, handleShield } = props;
  return (
    <View style={styled.container}>
      <Header
        title="Select a coin to shield"
        canSearch
        rightHeader={<BtnQuestionDefault onPress={handleWhyShield} />}
      />
      <ScrollView style={styled.scrollview}>
        {data.map(token => (
          <Token
            key={token?.id}
            tokenId={token?.id}
            onPress={() => handleShield(token?.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

Shield.propTypes = {
  data: PropTypes.array.isRequired,
  handleWhyShield: PropTypes.func.isRequired,
  handleShield: PropTypes.func.isRequired,
};

export default withShield(Shield);
