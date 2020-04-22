import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {COLORS, FONT} from '@src/styles';
import {ClockIcon} from '@src/components/Icons';
import {BtnDefault} from '@src/components/Button';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
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
  thanks: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    textAlign: 'center',
    color: COLORS.black,
    marginBottom: 20,
  },
  icon: {
    marginBottom: 10,
  },
});

const ShowStatusDeposit = props => {
  const {btnSubmitStatus, onHandlePress} = props;
  return (
    <View style={styled.container}>
      <View style={styled.wrapper}>
        <View style={styled.icon}>
          <ClockIcon />
        </View>
        <Text style={styled.title}>Success!</Text>
        <Text style={styled.desc}>You made a deposit.</Text>
        <Text style={styled.desc}>
          Your new balance will update in 3 to 5 minutes.
        </Text>
        <Text style={styled.desc}>
          Your deposit is helping to power privacy for thousands of users around
          the world.
        </Text>
        <Text style={[styled.thanks]}>Thanks for staking with Incognito.</Text>
        <BtnDefault
          title={btnSubmitStatus}
          btnStyle={styled.btnSubmit}
          onPress={onHandlePress}
        />
      </View>
    </View>
  );
};

ShowStatusDeposit.propTypes = {
  btnSubmitStatus: PropTypes.string.isRequired,
  onHandlePress: PropTypes.func.isRequired,
};

export default ShowStatusDeposit;
