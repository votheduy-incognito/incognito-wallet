import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styleSheet from './style';
import { View, Image, Text, Divider, Button } from '@src/components/core';
import { hashToIdenticon } from '@src/services/wallet/RpcClientService';
import { COLORS } from '@src/styles';

import ROUTE_NAMES from '@src/router/routeNames';

const TokenItem = ({ token, navigation, accountWallet }) => {
  if (!token) { return null; }
  const [ imageSrc, setImageSrc ] = useState(null);
  const [ balance, setBalance ] = useState(null);

  const reloadBalanceToken = async () => {
    if (token.IsPrivacy) {
      return await accountWallet.getPrivacyCustomTokenBalance(token.ID);
    } 
    return await accountWallet.getCustomTokenBalance(token.ID);
  };

  useEffect(() => {
    token.ID && hashToIdenticon(token.ID).then(src=> {
      setImageSrc(src);
    });

    token.ID && reloadBalanceToken().then(balance => {
      setBalance(balance);
    });
  }, [token.ID]);

 

  const handleSendToken = () => {
    let isPrivacy = false;
    const key = this.tab?.getCurrentTabKey();
    if ( key === 'privacy'){
      isPrivacy = true;
    }

    navigation.navigate( 
      ROUTE_NAMES.CreateSendToken, 
      { isPrivacy, isCreate: false, token }
    );
  };

  return (
    <>
      <View style={styleSheet.itemContainer}>
        <View style={styleSheet.row}>
          { imageSrc && <Image style={styleSheet.image} source={{uri: imageSrc}} /> }
          <Text style={styleSheet.timeText} numberOfLines={1} ellipsizeMode='tail'>{token.Name}</Text>
          <Text style={styleSheet.timeText} numberOfLines={1} ellipsizeMode='tail'>{balance}</Text>
          <Button title='Send' onPress={handleSendToken} ></Button>
        </View>
      </View>
      <Divider style={styleSheet.divider} color={COLORS.lightGrey} />
    </>
  );
};

TokenItem.propTypes ={
  token: PropTypes.object,
  navigation: PropTypes.object,
  accountWallet: PropTypes.object
};

export default TokenItem;
