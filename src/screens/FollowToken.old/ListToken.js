import { Image, Text, TouchableOpacity, View } from '@src/components/core';
import Divider from '@src/components/core/Divider/Component';
import { COLORS } from '@src/styles';
import formatUtil from '@src/utils/format';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { tokenListStyle } from './style';

const TokenItem = ({ token, handlePress, isActive }) => (
  <TouchableOpacity
    onPress={() => handlePress(token)}
    style={[tokenListStyle.tokenItem, isActive && tokenListStyle.itemActive]}
  >
    {token?.image && (
      <Image style={tokenListStyle.tokenIcon} source={{ uri: token.image }} />
    )}
    <View style={tokenListStyle.infoContainer}>
      <Text numberOfLines={1} ellipsizeMode="middle">
        ID: 
        {' '}
        {token.id}
      </Text>
      <Text>
        Name:
        {token.name}
      </Text>
      <Text>
        Symbol:
        {token.symbol}
      </Text>
      <Text>
        Init amount:
        {formatUtil.amount(token.amount, token.symbol)}
      </Text>
    </View>
  </TouchableOpacity>
);

const ListToken = ({ tokenList, followedList, onFollow }) => {
  const followedId = followedList?.map(_follow => _follow?.id) || [];

  return (
    <View style={tokenListStyle.container}>
      {tokenList?.length > 0 ?
        tokenList.map(token => (
          <Fragment key={token?.id}>
            <TokenItem
              isActive={followedId.includes(token?.id)}
              token={token}
              handlePress={onFollow}
            />
            <Divider color={COLORS.lightGrey1} />
          </Fragment>
        )) : <Text>There has no token.</Text>
      }
    </View>
  );
};

export const tokenShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  amount: PropTypes.number
});

TokenItem.propTypes = {
  token: tokenShape,
  handlePress: PropTypes.func,
  isActive: PropTypes.bool
};

ListToken.propTypes = {
  onFollow: PropTypes.func,
  tokenList: PropTypes.arrayOf(tokenShape),
  followedList: PropTypes.arrayOf(tokenShape)
};

export default ListToken;
