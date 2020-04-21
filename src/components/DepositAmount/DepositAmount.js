import React from 'react';
import { View } from 'react-native';
import { Button, Text } from '@components/core/index';
import { useDispatch, useSelector } from 'react-redux';
import { accountSeleclor, selectedPrivacySeleclor, tokenSeleclor } from '@src/redux/selectors';
import PropTypes from 'prop-types';
import { useNavigation } from 'react-navigation-hooks';
import { ExHandler } from '@services/exception';
import routeNames from '@routers/routeNames';
import TokenSelect from '@components/TokenSelect/index';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import CryptoIcon from '@components/CryptoIcon/index';
import VerifiedText from '@components/VerifiedText/index';
import PToken from '@models/pToken';
import internalTokenModel from '@models/token';
import accountService from '@services/wallet/accountService';
import { setWallet } from '@src/redux/actions/wallet';
import FloatButton from '@src/components/FloatButton';
import { generateTestId } from '@utils/misc';
import { TOKEN } from '@src/constants/elements';
import { styled } from './DepositAmount.styled';
import withDepositAmount from './DepositAmount.enhance';

const DepositAmount = props => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const pTokens = useSelector(tokenSeleclor.pTokens);
  const internalTokens = useSelector(tokenSeleclor.internalTokens);
  const account = useSelector(accountSeleclor.defaultAccount);
  const wallet = useSelector(state => state.wallet);
  const dispatch = useDispatch();
  const { symbol, tokenId, isVerified } = selectedPrivacy;
  const { onComplete, showGuide } = props;

  const originalSymbol = symbol.substring(1);
  const navigation = useNavigation();

  const handleShield = async () => {
    try {
      const foundPToken: PToken = pTokens?.find((pToken: PToken) => pToken.tokenId === tokenId);
      const foundInternalToken = !foundPToken && internalTokens?.find(token => token.id === tokenId);
      const token = (foundInternalToken && internalTokenModel.toJson(foundInternalToken)) || foundPToken?.convertToToken();
      await accountService.addFollowingTokens([token], account, wallet);

      dispatch(setWallet(wallet));

      onComplete(0);
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const handleSelectToken = (tokenId) => {
    dispatch(setSelectedPrivacy(tokenId));
  };

  const isReceive = navigation?.state?.routeName === routeNames.ReceiveCoin;
  const label = isReceive ?
    'Which cryptocurrency do you want to receive anonymously?'
    : 'Which cryptocurrency do you want to shield?';
  const btnTitle = isReceive ? 'Receive' : 'Shield';

  return (
    <View style={showGuide && styled.container}>
      <View style={styled.textContainer}>
        <Text style={styled.label}>{label}</Text>
        <View style={styled.token}>
          <CryptoIcon key={tokenId} tokenId={tokenId} size={30} />
          <VerifiedText
            text={originalSymbol}
            isVerified={isVerified}
            containerStyle={styled.tokenText}
            {...generateTestId(TOKEN.CURRENT)}
          />
          <TokenSelect
            onSelect={handleSelectToken}
            onlyPToken
            showOriginalSymbol
            size={25}
            style={{
              height: 40,
              bottom: -5,
            }}
            toggleStyle={styled.toggle}
            iconStyle={styled.selector}
          />
        </View>
        <Button
          title={btnTitle}
          style={styled.btnStyle}
          onPress={handleShield}
          {...generateTestId(TOKEN.RECEIVE_BTN)}
        />

      </View>
      {showGuide ? (
        <FloatButton onPress={() => navigation.navigate(routeNames.WhyShield)} label='Find out why' />
      ) : null}
    </View>
  );
};

DepositAmount.propTypes = {
  onComplete: PropTypes.func.isRequired,
  showGuide: PropTypes.bool,
};

DepositAmount.defaultProps = {
  showGuide: false,
};

export default withDepositAmount(DepositAmount);
