import React from 'react';
import { View, Text } from 'react-native';
import Header from '@src/components/Header';
import { TokenBasic as Token, ListToken } from '@src/components/Token';
import PropTypes from 'prop-types';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import {
  TouchableOpacity,
  KeyboardAwareScrollView,
} from '@src/components/core';
import { BtnChecked } from '@src/components/Button';
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
  const {
    tokensFactories,
    handleToggleFollowToken,
    onToggleUnVerifiedTokens,
    toggleUnVerified,
  } = props;
  return (
    <View style={styled.container}>
      <Header title="Add a coin" canSearch />
      <KeyboardAwareScrollView>
        <ListToken
          {...tokensFactories[0]}
          renderItem={({ item }) => (
            <Item
              item={item}
              handleToggleFollowToken={handleToggleFollowToken}
            />
          )}
        />
        <BtnChecked
          btnStyle={styled.hook}
          onPress={onToggleUnVerifiedTokens}
          checked={toggleUnVerified}
          hook={<Text style={styled.hookText}>Show unverified coins</Text>}
        />
        <ListToken
          {...tokensFactories[1]}
          renderItem={({ item }) => (
            <Item
              item={item}
              handleToggleFollowToken={handleToggleFollowToken}
            />
          )}
        />
      </KeyboardAwareScrollView>
      <AddManually />
    </View>
  );
});

FollowToken.propTypes = {
  tokensFactories: PropTypes.any.isRequired,
  handleToggleFollowToken: PropTypes.array.isRequired,
  onToggleUnVerifiedTokens: PropTypes.func.isRequired,
  toggleUnVerified: PropTypes.bool.isRequired,
};

export default withFollowToken(FollowToken);
