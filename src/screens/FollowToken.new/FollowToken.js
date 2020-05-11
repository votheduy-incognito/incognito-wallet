import React from 'react';
import { View, FlatList, Text } from 'react-native';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import { useSelector } from 'react-redux';
import { availableTokensSelector } from '@src/redux/selectors/shared';
import { styled } from './FollowToken.styled';

const AddManually = () => {
  const title = 'Don\'t see your coin?';
  return (
    <View style={styled.addManually}>
      <Text style={styled.text}>{title}</Text>
      <Text style={[styled.text, styled.boldText]}>Add manually +</Text>
    </View>
  );
};

const FollowToken = props => {
  const data = useSelector(availableTokensSelector);

  const renderItem = item => null;

  const keyExtractor = item => item?.tokenId || item?.id;
  return (
    <View style={styled.container}>
      <Header title="Add a coin" canSearch />
      <FlatList
        style={styled.flatList}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <AddManually />
    </View>
  );
};

FollowToken.propTypes = {};

export default withLayout_2(FollowToken);
