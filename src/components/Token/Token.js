import React from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import withToken from '@src/components/Token/Token.enhance';
import { TokenVerifiedIcon } from '@src/components/Icons';
import format from '@src/utils/format';
import floor from 'lodash/floor';
import { CONSTANT_COMMONS } from '@src/constants';
import { styled } from './Token.styled';

export const TokenContext = React.createContext(null);

const NormalText = ({ style, text, hasPSymbol = false }) => (
  <Text numberOfLines={1} style={[styled.text, style]}>
    {hasPSymbol && <Text style={[styled.pSymbol, styled.text, style]}>ℙ</Text>}{' '}
    {text}
  </Text>
);

export const Name = props => {
  const { tokenProps } = React.useContext(TokenContext);
  const { displayName, isVerified } = tokenProps;
  return (
    <View style={styled.name}>
      <NormalText
        text={displayName}
        style={[styled.boldText, props?.styledDisplayName]}
      />
      {isVerified && <TokenVerifiedIcon style={styled.verifiedIcon} />}
    </View>
  );
};

const AmountBasePRV = () => {
  const { tokenProps } = React.useContext(TokenContext);
  const { amount, pricePrv } = tokenProps;
  return (
    <NormalText
      hasPSymbol
      text={`${format.amount(
        floor(pricePrv * amount),
        CONSTANT_COMMONS.PRV.pDecimals,
      )} `}
      style={[styled.boldText]}
    />
  );
};

const Price = () => {
  const { tokenProps } = React.useContext(TokenContext);
  const { pricePrv, change } = tokenProps;
  const isTokenDecrease = change[0] === '-';
  const changeToNumber = Number(change.replace('-', ''));
  return (
    <View style={styled.priceContainer}>
      <NormalText text={format.amount(floor(pricePrv, 9), 0)} hasPSymbol />
      {changeToNumber !== 0 && (
        <NormalText
          text={`${isTokenDecrease ? '-' : '+'}${floor(changeToNumber, 2)}%`}
          style={isTokenDecrease ? styled.redText : styled.greenText}
        />
      )}
    </View>
  );
};

const Amount = () => {
  const { tokenProps } = React.useContext(TokenContext);
  const { amount, pDecimals, symbol, isGettingBalance } = tokenProps;
  if (isGettingBalance) {
    return <ActivityIndicator size="small" />;
  }
  return <NormalText text={`${format.amount(amount, pDecimals)} ${symbol}`} />;
};

export const Symbol = () => {
  const { tokenProps } = React.useContext(TokenContext);
  const { symbol } = tokenProps;
  return <NormalText text={symbol} />;
};

const Token = props => {
  const { onPress, style } = props;
  return (
    <TokenContext.Provider
      value={{
        tokenProps: props,
      }}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styled.container, style]}>
          <View style={styled.extra}>
            <Name />
            <AmountBasePRV />
          </View>
          <View style={styled.extra}>
            <Price />
            <Amount />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </TokenContext.Provider>
  );
};

Name.defaultProps = {
  styledDisplayName: null,
};

Name.propTypes = {
  styledDisplayName: PropTypes.object,
};

Token.defaultProps = {
  displayName: 'Sample name',
  amount: 0,
  onPress: null,
  symbol: null,
  isGettingBalance: false,
  style: null,
  pDecimals: null,
  isVerified: false,
  iconUrl: null,
  amountInPRV: 0,
  price: 0,
  percentChange: 0,
  pricePrv: 0,
};

Token.propTypes = {
  pDecimals: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  displayName: PropTypes.string,
  amount: PropTypes.number,
  onPress: PropTypes.func,
  symbol: PropTypes.string,
  isGettingBalance: PropTypes.bool,
  style: PropTypes.object,
  isVerified: PropTypes.bool,
  iconUrl: PropTypes.string,
  amountInPRV: PropTypes.number,
  price: PropTypes.number,
  percentChange: PropTypes.number,
  pricePrv: PropTypes.number,
};

export default withToken(Token);
