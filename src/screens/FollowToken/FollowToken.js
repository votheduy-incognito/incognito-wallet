import React from 'react';
import { View, Text } from 'react-native';
import Header from '@src/components/Header';
import { TokenBasic as Token, ListAllToken } from '@src/components/Token';
import PropTypes from 'prop-types';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { TouchableOpacity } from '@src/components/core';
import { styled } from './FollowToken.styled';
import withFollowToken from './FollowToken.enhance';

const AddManually = () => {
  const title = 'Don\'t see your coin?';
  const navigation = useNavigation();
  const handleAddTokenManually = () =>
    navigation?.navigate(routeNames.AddManually, { type: 'ERC20' });
  return (
    <View style={styled.addManually}>
      <Text style={styled.text}>{title}</Text>
      <TouchableOpacity onPress={handleAddTokenManually}>
        <Text style={[styled.text, styled.boldText, { marginTop: 5 }]}>
          Add manually +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Item = ({ item, handleToggleFollowToken }) =>
  React.useMemo(() => {
    return (
      <Token
        onPress={() => handleToggleFollowToken(item)}
        tokenId={item?.tokenId}
        name="displayName"
        symbol="pSymbol"
        shouldShowFollowed
      />
    );
  }, [item?.isFollowed]);

const FollowToken = React.memo((props) => {
  const { handleToggleFollowToken, ...rest } = props;
  return (
    <View style={styled.container}>
      <Header title="Add a coin" canSearch />
      <ListAllToken
        {...rest}
        renderItem={({ item }) => (
          <Item item={item} handleToggleFollowToken={handleToggleFollowToken} />
        )}
      />
      <AddManually />
    </View>
  );
});

FollowToken.propTypes = {
  handleToggleFollowToken: PropTypes.func.isRequired,
  tokensFactories: PropTypes.array.isRequired,
};

export default withFollowToken(FollowToken);
