import React, { useState, useEffect } from 'react';
import { View, Image, Text, Divider } from '@src/components/core';
import OptionMenu from '@src/components/OptionMenu';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import { tokenItemStyle } from './style';
import { hashToIdenticon } from '@src/services/wallet/RpcClientService';
import { COLORS } from '@src/styles';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';

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
    navigation.navigate( 
      ROUTE_NAMES.CreateSendToken, 
      { isPrivacy: token.IsPrivacy, isCreate: false, token }
    );
  };

  const menuData = [
    {
      id: 'send',
      label: 'Send',
      handlePress: handleSendToken,
      icon: <MdIcons name='send' size={20} />
    },
    {
      id: 'unfollow',
      label: 'Unfollow',
      handlePress: null,
      icon: <MdIcons name='remove-circle-outline' size={20} />
    },
    {
      id: 'history',
      label: 'History',
      handlePress: null,
      icon: <MdIcons name='history' size={22} />
    }
  ];

  return (
    <>
      <View style={tokenItemStyle.container}>
        { imageSrc && <Image style={tokenItemStyle.image} source={{uri: imageSrc}} /> }
        <View style={tokenItemStyle.infoContainer}>
          <Text style={tokenItemStyle.name} numberOfLines={1} ellipsizeMode='tail'>{token.Name}</Text>
          <Text style={tokenItemStyle.amount} numberOfLines={1} ellipsizeMode='tail'>{balance}</Text>
        </View>
        <OptionMenu data={menuData} title={`Token ${token?.Name}`} />
      </View>
      <Divider style={tokenItemStyle.divider} color={COLORS.lightGrey} />
    </>
  );
};

TokenItem.propTypes ={
  token: PropTypes.object,
  navigation: PropTypes.object,
  accountWallet: PropTypes.object
};

export default TokenItem;
