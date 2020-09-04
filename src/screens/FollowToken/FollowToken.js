import React from 'react';
import { View, Text } from 'react-native';
import Header from '@src/components/Header';
import { TokenBasic as Token } from '@src/components/Token';
import PropTypes from 'prop-types';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import {
  TouchableOpacity,
  KeyboardAwareScrollView,
} from '@src/components/core';
import { FlatList } from '@src/components/core/FlatList';
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

const Hook = React.memo((props) => {
  const { toggleUnVerified, handleFilterTokensUnVerified } = props;
  return (
    <View style={styled.hook}>
      <BtnChecked
        onPress={handleFilterTokensUnVerified}
        checked={toggleUnVerified}
      />
      <Text style={styled.hookText}>Show unverified coins</Text>
    </View>
  );
});

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

const ListToken = (props) => {
  const {
    data,
    handleToggleFollowToken,
    isVerifiedTokens,
    visible,
    styledListToken,
    ...rest
  } = props;
  if (!visible || data.length === 0) {
    return null;
  }
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={styledListToken}
      data={data}
      renderItem={({ item }) => <Item {...{ item, handleToggleFollowToken }} />}
      keyExtractor={(token) => token?.tokenId}
      removeClippedSubviews
      initialNumToRender={10}
      ListFooterComponent={isVerifiedTokens ? <Hook {...rest} /> : null}
    />
  );
};

const FollowToken = React.memo((props) => {
  const { tokensFactories, ...rest } = props;
  return (
    <View style={styled.container}>
      <Header title="Add a coin" canSearch />
      <KeyboardAwareScrollView>
        {tokensFactories.map((item, index) => (
          <ListToken {...{ ...rest, ...item }} key={index} />
        ))}
      </KeyboardAwareScrollView>
      <AddManually />
    </View>
  );
});

FollowToken.propTypes = {
  tokensFactories: PropTypes.any.isRequired,
};

ListToken.propTypes = {
  data: PropTypes.array.isRequired,
  handleToggleFollowToken: PropTypes.func.isRequired,
  isVerifiedTokens: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  styledListToken: PropTypes.any.isRequired,
};

Hook.propTypes = {
  toggleUnVerified: PropTypes.bool.isRequired,
  handleFilterTokensUnVerified: PropTypes.func.isRequired,
};

export default withFollowToken(FollowToken);
