import React from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {Button, Text, TouchableOpacity} from '@components/core/index';
import {useDispatch, useSelector} from 'react-redux';
import {accountSeleclor, selectedPrivacySeleclor, tokenSeleclor} from '@src/redux/selectors';
import PropTypes from 'prop-types';
import {useNavigation} from 'react-navigation-hooks';
import {ExHandler} from '@services/exception';
import routeNames from '@routers/routeNames';
import TokenSelect from '@components/TokenSelect/index';
import {setSelectedPrivacy} from '@src/redux/actions/selectedPrivacy';
import CryptoIcon from '@components/CryptoIcon/index';
import VerifiedText from '@components/VerifiedText/index';
import {Icon} from 'react-native-elements';
import {isIOS} from '@utils/platform';
import PToken from '@models/pToken';
import internalTokenModel from '@models/token';
import accountService from '@services/wallet/accountService';
import {setWallet} from '@src/redux/actions/wallet';
import {styled} from './DepositAmount.styled';
import withDepositAmount from './DepositAmount.enhance';

const DepositAmount = props => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const pTokens = useSelector(tokenSeleclor.pTokens);
  const internalTokens = useSelector(tokenSeleclor.internalTokens);
  const account = useSelector(accountSeleclor.defaultAccount);
  const wallet = useSelector(state => state.wallet);
  const dispatch = useDispatch();
  const {symbol, tokenId, isVerified} = selectedPrivacy;
  const {onComplete, showGuide} = props;

  const originalSymbol = symbol.substring(1);
  const navigation = useNavigation();

  const handleShield = async () => {
    try {
      const foundPToken : PToken = pTokens?.find((pToken: PToken) => pToken.tokenId === tokenId);
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

  const Wrapper = isIOS() ? KeyboardAvoidingView : View;

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
        />

      </View>
      { showGuide ? (
        <Wrapper
          contentContainerStyle={{ position: 'absolute', bottom: 0 }}
          style={{ position: 'absolute', bottom: 0 }}
          keyboardVerticalOffset={isIOS() ? 160 : 0}
          behavior={isIOS() ? 'position' : undefined}
        >
          <TouchableOpacity
            style={styled.floatBtn}
            onPress={() => navigation.navigate(routeNames.WhyShield)}
          >
            <View style={styled.btnIcon}>
              <Icon name="chevron-right" />
            </View>
            <Text style={styled.text}>Find out why</Text>
          </TouchableOpacity>
        </Wrapper>
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
