import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Header from '@src/components/Header';
import { BtnSelectAccount } from '@screens/SelectAccount';
import { ButtonBasic, BtnQRCode } from '@src/components/Button';
import { tokenSeleclor } from '@src/redux/selectors';
import { useSelector } from 'react-redux';
import Token from '@src/components/Token';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { CONSTANT_COMMONS } from '@src/constants';
import { totalShieldedTokensSelector } from '@src/redux/selectors/shared';
import format from '@src/utils/format';
import floor from 'lodash/floor';
import {
  styled,
  styledHook,
  styledBalance,
  styledAddToken,
  styledFollow,
  extraStyled,
  styledToken,
  rightHeaderStyled,
} from './Wallet.styled';
import withWallet from './Wallet.enhance';

const WalletContext = React.createContext({});

const GroupButton = () => {
  const navigation = useNavigation();
  const handleShield = () => navigation.navigate(routeNames.Shield);
  const handleUnShield = () => navigation.navigate(routeNames.SendCrypto);
  return (
    <View style={styled.groupButton}>
      <ButtonBasic
        title="Shield"
        btnStyle={styled.btnStyle}
        titleStyle={styled.titleStyle}
        onPress={handleShield}
      />
      <ButtonBasic
        title="Unshield"
        btnStyle={styled.btnStyle}
        titleStyle={styled.titleStyle}
        onRefresh={handleUnShield}
      />
    </View>
  );
};

const Hook = () => {
  const totalShielded = useSelector(totalShieldedTokensSelector);
  if (totalShielded !== 0) {
    return null;
  }
  return (
    <View style={styledHook.container}>
      <Text style={styledHook.title}>Transact without a trace.</Text>
      <Text style={styledHook.desc}>
        {
          'Shield any amount of any cryptocurrency.\nTurn your public coins into privacy coins.'
        }
      </Text>
    </View>
  );
};

const Balance = () => {
  const totalShielded = useSelector(totalShieldedTokensSelector);
  return (
    <View style={styledBalance.container}>
      <Text style={styledBalance.balance}>
        <Text
          style={[
            styledBalance.balance,
            {
              fontFamily: 'HelveticaNeue',
            },
          ]}
        >
          ℙ
        </Text>{' '}
        {totalShielded === 0
          ? '0.00'
          : format.amount(
            floor(totalShielded, 9),
            CONSTANT_COMMONS.PRV.pDecimals,
          )}
      </Text>
      <Text style={styledBalance.title}>Shielded Balance</Text>
    </View>
  );
};

const FollowToken = () => {
  const followed = useSelector(tokenSeleclor.tokensFollowedSelector);
  const { walletProps } = React.useContext(WalletContext);
  const { handleSelectToken } = walletProps;
  return (
    <View style={styledFollow.container}>
      <Token
        tokenId={CONSTANT_COMMONS.PRV_TOKEN_ID}
        style={[followed.length === 0 && styledToken.lastChild]}
        onPress={() => handleSelectToken(CONSTANT_COMMONS.PRV_TOKEN_ID)}
      />
      {followed.map((token, index) => (
        <Token
          key={token?.id}
          tokenId={token?.id}
          style={[followed.length - 1 === index && styledToken.lastChild]}
          onPress={() => handleSelectToken(token?.id)}
        />
      ))}
    </View>
  );
};

const AddToken = () => {
  const navigation = useNavigation();
  const handleFollowToken = () => navigation.navigate(routeNames.FollowToken);
  return (
    <TouchableWithoutFeedback onPress={handleFollowToken}>
      <View style={styledAddToken.container}>
        <Text style={styledAddToken.title}>Add a coin +</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Extra = () => {
  const { walletProps } = React.useContext(WalletContext);
  const { isReloading, reload } = walletProps;
  return (
    <View style={extraStyled.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isReloading} onRefresh={reload} />
        }
      >
        <Balance />
        <GroupButton />
        <Hook />
        <FollowToken />
        <AddToken />
      </ScrollView>
    </View>
  );
};

const RightHeader = () => {
  const { walletProps } = React.useContext(WalletContext);
  const { handleExportKey } = walletProps;
  return (
    <View style={rightHeaderStyled.container}>
      <BtnQRCode
        style={rightHeaderStyled.btnExportKey}
        onPress={handleExportKey}
      />
      <BtnSelectAccount />
    </View>
  );
};

const Wallet = props => {
  return (
    <WalletContext.Provider
      value={{
        walletProps: props,
      }}
    >
      <View style={styled.container}>
        <Header title="Keychain" rightHeader={<RightHeader />} />
        <Extra />
      </View>
    </WalletContext.Provider>
  );
};

Wallet.propTypes = {};

export default withWallet(Wallet);
