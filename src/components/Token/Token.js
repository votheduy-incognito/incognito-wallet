import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import withToken, { TokenContext } from '@src/components/Token/Token.enhance';
import { TokenVerifiedIcon } from '@src/components/Icons';
import format from '@src/utils/format';
import floor from 'lodash/floor';
import { CONSTANT_COMMONS } from '@src/constants';
import Swipeout from 'react-native-swipeout';
import { COLORS } from '@src/styles';
import { BtnDelete } from '@src/components/Button';
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
    {hasPSymbol && <Text style={[styled.pSymbol, styled.text, style]}>ℙ</Text>}
    {text}
  </Text>
);

export const Name = props => {
  const { tokenProps } = React.useContext(TokenContext);
  const { name = 'Sample Name', isVerified = false } =
    tokenProps || defaultProps;
  return (
    <View style={styled.name}>
      <NormalText text={name} style={[styled.boldText, props?.styledName]} />
      {isVerified && <TokenVerifiedIcon style={styled.verifiedIcon} />}
    </View>
  );
};

export const AmountBasePRV = props => {
  const { amount = 0, pricePrv = 0, customStyle = null } = props;
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
  const { change = '0', customStyle = null } = props;
  const isTokenDecrease = change[0] === '-';
  const changeToNumber = Number(change.replace('-', ''));
  if (changeToNumber === 0) {
    return null;
  }
  return (
    <NormalText
      text={` ${isTokenDecrease ? '-' : '+'}${floor(changeToNumber, 2)}%`}
      style={[
        styled.bottomText,
        isTokenDecrease ? styled.redText : styled.greenText,
        customStyle,
      ]}
    />
  );
};

const Price = () => {
  const { tokenProps } = React.useContext(TokenContext);
  const { pricePrv = 0, change = '0' } = tokenProps;
  return (
    <View style={styled.priceContainer}>
      <NormalText
        style={styled.bottomText}
        text={format.amount(floor(pricePrv, 9), 0)}
        hasPSymbol
      />
      <ChangePrice change={change} />
    </View>
  );
};

export const Amount = props => {
  const {
    amount = 0,
    pDecimals = 0,
    symbol = '',
    customStyle = null,
    showSymbol = true,
  } = props;
  return (
    <NormalText
      style={[styled.bottomText, customStyle]}
      text={`${format.amount(amount, pDecimals)} ${showSymbol ? symbol : ''}`}
    />
  );
};

export const Symbol = () => {
  const { tokenProps } = React.useContext(TokenContext);
  const { symbol, networkName, isErc20Token } = tokenProps || defaultProps;
  return (
    <NormalText style={styled.bottomText} text={`${symbol} ${isErc20Token ? `(${networkName})` : ''}`} />
  );
};

const Token = props => {
  const {
    onPress,
    handleRemoveToken = null,
    style = null,
    swipable = false,
  } = props;
  const TokenComponent = (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styled.container, style]}>
        <View style={[styled.extra, { marginBottom: 10 }]}>
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
  if (swipable === true) {
    return (
      <Swipeout
        autoClose
        style={{
          backgroundColor: 'transparent',
        }}
        right={[
          {
            component: (
              <BtnDelete
                onPress={
                  typeof handleRemoveToken === 'function'
                    ? handleRemoveToken
                    : null
                }
              />
            ),
          },
        ]}
      >
        {TokenComponent}
      </Swipeout>
    );
  }
  return TokenComponent;
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
  swipable: PropTypes.bool,
  removable: PropTypes.bool,
  handleRemoveToken: PropTypes.func,
};

export default withToken(React.memo(Token));
