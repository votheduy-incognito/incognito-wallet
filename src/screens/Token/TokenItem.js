import { Divider, Image, Text, View } from '@src/components/core';
import OptionMenu from '@src/components/OptionMenu';
import ROUTE_NAMES from '@src/router/routeNames';
import { hashToIdenticon } from '@src/services/wallet/RpcClientService';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import { tokenItemStyle } from './style';

const TokenItem = ({
  token,
  navigation,
  accountWallet,
  onRemoveFollowToken
}) => {
  if (!token) {
    return null;
  }
  const [imageSrc, setImageSrc] = useState(null);
  const [balance, setBalance] = useState(null);

  const reloadBalanceToken = async () => {
    if (token.IsPrivacy) {
      setBalance(await accountWallet.getPrivacyCustomTokenBalance(token.ID));
    } else {
      setBalance(await accountWallet.getCustomTokenBalance(token.ID));
    }
  };

  useEffect(() => {
    token.ID &&
      hashToIdenticon([token.ID]).then(images => {
        setImageSrc(images[0]);
      });

    reloadBalanceToken();
  }, [token.ID]);

  const handleSendToken = () => {
    navigation.navigate(ROUTE_NAMES.CreateSendToken, {
      isPrivacy: token.IsPrivacy,
      isCreate: false,
      token,
      reloadBalanceToken
    });
  };

  const handleShowHistory = () => {
    navigation.navigate(ROUTE_NAMES.HistoryToken, { token });
  };

  const menuData = [
    {
      id: 'send',
      label: 'Send',
      handlePress: handleSendToken,
      icon: <MdIcons name="send" size={20} />
    },
    {
      id: 'unfollow',
      label: 'Unfollow',
      handlePress: () => onRemoveFollowToken(token.ID),
      icon: <MdIcons name="remove-circle-outline" size={20} />
    },
    {
      id: 'history',
      label: 'History',
      handlePress: handleShowHistory,
      icon: <MdIcons name="history" size={22} />
    }
  ];

  return (
    <>
      <View style={tokenItemStyle.container}>
        {imageSrc && (
          <Image style={tokenItemStyle.image} source={{ uri: imageSrc }} />
        )}
        <View style={tokenItemStyle.infoContainer}>
          <Text
            style={tokenItemStyle.name}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {token.Name}
          </Text>
          <Text
            style={tokenItemStyle.amount}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {balance}
          </Text>
        </View>
        <OptionMenu data={menuData} title={`Token ${token?.Name}`} />
      </View>
      <Divider style={tokenItemStyle.divider} color={COLORS.lightGrey} />
    </>
  );
};
TokenItem.defaultProps = {
  token: undefined,
  navigation: undefined,
  accountWallet: undefined,
  onRemoveFollowToken: undefined
};
TokenItem.propTypes = {
  token: PropTypes.objectOf(PropTypes.object),
  navigation: PropTypes.objectOf(PropTypes.object),
  accountWallet: PropTypes.objectOf(PropTypes.object),
  onRemoveFollowToken: PropTypes.func
};

export default TokenItem;
