import React from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import withToken, { TokenContext } from '@src/components/Token/Token.enhance';
import { TokenVerifiedIcon } from '@src/components/Icons';
import format from '@src/utils/format';
import floor from 'lodash/floor';
import { CONSTANT_COMMONS } from '@src/constants';
import { styled } from './Token.styled';

const defaultProps = {
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

export const NormalText = ({ style, text, hasPSymbol = false }) => (
  <Text numberOfLines={1} style={[styled.text, style]}>
    {hasPSymbol && <Text style={[styled.pSymbol, styled.text, style]}>ℙ</Text>}{' '}
    {text}
  </Text>
);

export const Name = props => {
  const { tokenProps } = React.useContext(TokenContext);
  const { name, isVerified } = tokenProps || defaultProps;
  return (
    <View style={styled.name}>
      <NormalText text={name} style={[styled.boldText, props?.styledName]} />
      {isVerified && <TokenVerifiedIcon style={styled.verifiedIcon} />}
    </View>
  );
};

export const AmountBasePRV = props => {
  const { amount, pricePrv, customStyle = null } = props || defaultProps;
  return (
    <NormalText
      hasPSymbol
      text={`${format.amount(
        floor(pricePrv * amount),
        CONSTANT_COMMONS.PRV.pDecimals,
      )} `}
      style={[styled.boldText, styled.rightText, customStyle]}
    />
  );
};

export const ChangePrice = props => {
  const { change = '0', customStyle = null } = props || defaultProps;
  const isTokenDecrease = change[0] === '-';
  const changeToNumber = Number(change.replace('-', ''));
  if (changeToNumber === 0) {
    return null;
  }
  return (
    <NormalText
      text={`${isTokenDecrease ? '-' : '+'}${floor(changeToNumber, 2)}%`}
      style={[isTokenDecrease ? styled.redText : styled.greenText, customStyle]}
    />
  );
};

const Price = () => {
  const { tokenProps } = React.useContext(TokenContext);
  const { pricePrv, change } = tokenProps || defaultProps;
  return (
    <View style={styled.priceContainer}>
      <NormalText text={format.amount(floor(pricePrv, 9), 0)} hasPSymbol />
      <ChangePrice change={change} />
    </View>
  );
};

export const Amount = props => {
  const {
    amount,
    pDecimals,
    symbol,
    isGettingBalance,
    customStyle = null,
    showSymbol = true,
  } = props || defaultProps;
  if (isGettingBalance) {
    return <ActivityIndicator size="small" />;
  }
  return (
    <NormalText
      style={customStyle}
      text={`${format.amount(amount, pDecimals)} ${showSymbol ? symbol : ''}`}
    />
  );
};

export const Symbol = () => {
  const { tokenProps } = React.useContext(TokenContext);
  const { symbol, networkName, isErc20Token } = tokenProps || defaultProps;
  return (
    <NormalText text={`${symbol} ${isErc20Token ? `(${networkName})` : ''}`} />
  );
};

const Token = props => {
  const { onPress, style } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styled.container, style]}>
        <View style={styled.extra}>
          <Name />
          <AmountBasePRV {...props} />
        </View>
        <View style={styled.extra}>
          <Price />
          <Amount {...props} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

Name.defaultProps = {
  styledName: null,
};

Name.propTypes = {
  styledName: PropTypes.object,
};

Token.defaultProps = { ...defaultProps };

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

export default withToken(React.memo(Token));
