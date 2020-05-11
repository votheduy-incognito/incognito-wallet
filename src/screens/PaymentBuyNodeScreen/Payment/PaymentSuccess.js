import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {COLORS, FONT} from '@src/styles';
import {ClockIcon} from '@src/components/Icons';
import {BtnDefault} from '@src/components/Button';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#00000040'
  },
  wrapper: {
    borderRadius: 8,
    paddingVertical: 50,
    paddingHorizontal: 30,
    backgroundColor: COLORS.white,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
    textAlign: 'center',
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    marginBottom: 20,
    textAlign: 'center',
  },
  icon: {
    marginBottom: 10,
  },
});

const PaymentSuccess = props => {
  const {onHandlePress} = props;
  return (
    <View style={styled.container}>
      <View style={styled.wrapper}>
        <View style={styled.icon}>
          <ClockIcon />
        </View>
        <Text style={styled.title}>Success!</Text>
        <Text style={styled.desc}>You made a payment.</Text>
        <Text style={styled.desc}>
          {'We\'ll send you an order confirmation within 24 hours of receiving your cryptocurrency payment.'}
        </Text>
        <BtnDefault
          title="Back to your wallet"
          btnStyle={styled.btnSubmit}
          onPress={onHandlePress}
        />
      </View>
    </View>
  );
};

PaymentSuccess.propTypes = {
  btnSubmitStatus: PropTypes.string.isRequired,
  onHandlePress: PropTypes.func.isRequired,
};

export default PaymentSuccess;
