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
    {token?.Image && (
      <Image style={tokenListStyle.tokenIcon} source={{ uri: token.Image }} />
    )}
    <View style={tokenListStyle.infoContainer}>
      <Text numberOfLines={1} ellipsizeMode="middle">
        ID: 
        {' '}
        {token.ID}
      </Text>
      <Text>
Name:
        {token.Name}
      </Text>
      <Text>
Symbol:
        {token.Symbol}
      </Text>
      <Text>
Init amount:
        {formatUtil.amount(token.Amount)}
      </Text>
    </View>
  </TouchableOpacity>
);

const ListToken = ({ tokenList, followedList, onFollow }) => {
  const followedId = followedList?.map(_follow => _follow?.ID) || [];

  return (
    <View style={tokenListStyle.container}>
      {tokenList &&
        tokenList.map(token => (
          <Fragment key={token?.ID}>
            <TokenItem
              isActive={followedId.includes(token?.ID)}
              token={token}
              handlePress={onFollow}
            />
            <Divider color={COLORS.lightGrey} />
          </Fragment>
        ))}
    </View>
  );
};

export const tokenShape = PropTypes.shape({
  ID: PropTypes.string,
  Name: PropTypes.string,
  Image: PropTypes.string,
  Amount: PropTypes.number
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
