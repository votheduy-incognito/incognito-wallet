import React, { useState, useEffect } from 'react';
// import TokenTabs from './TokenTabs';
import { View, Image, Text, Divider } from '@src/components/core';
import styleSheet from './style';
import { hashToIdenticon } from '@src/services/wallet/RpcClientService';
import { COLORS } from '@src/styles';

const TokenItem = ({ token }) => {
  if (!token) { return null; }
  const [ imageSrc, setImageSrc ] = useState(null);

  useEffect(() => {
    token.ID && hashToIdenticon(token.ID).then(src=> {
      setImageSrc(src);
    });
  }, [token.ID]);

  return (
    <>
      <View style={styleSheet.itemContainer}>
        <View style={styleSheet.row}>
          { imageSrc && <Image style={styleSheet.image} source={{uri: imageSrc}} /> }
          <Text style={styleSheet.timeText} numberOfLines={1} ellipsizeMode='tail'>{token.Name}</Text>
          <Text style={styleSheet.timeText} numberOfLines={1} ellipsizeMode='tail'>{token.Amount}</Text>
        </View>
      </View>
      <Divider style={styleSheet.divider} color={COLORS.lightGrey} />
    </>
  );
};

export default TokenItem;
