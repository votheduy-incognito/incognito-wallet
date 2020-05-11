import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '@src/components/Header';
import AddInternalToken from '@src/components/AddInternalToken';
import { BtnQuestionDefault } from '@src/components/Button';
import { withLayout_2 } from '@src/components/Layout';
import { styled } from './CreateToken.styled';

const CreateToken = () => {
  return (
    <View style={styled.container}>
      <Header title="Min a privacy coin" rightHeader={<BtnQuestionDefault />} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <AddInternalToken />
      </ScrollView>
    </View>
  );
};

CreateToken.propTypes = {};

export default withLayout_2(CreateToken);
