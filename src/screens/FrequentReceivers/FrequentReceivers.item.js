import React from 'react';
import Swipeout from 'react-native-swipeout';
import { BtnDelete } from '@src/components/Button';
import { TouchableOpacity } from '@src/components/core';
import { View, Text, StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';
import { ExHandler } from '@src/services/exception';
import { useDispatch } from 'react-redux';
import { actionDelete } from '@src/redux/actions/receivers';
import PropTypes from 'prop-types';

const itemStyled = StyleSheet.create({
  hook: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingLeft: 25,
  },
  name: {
    color: COLORS.black,
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    marginBottom: 15,
  },
  address: {
    color: COLORS.colorGreyBold,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 4,
  },
});

const Item = ({
  keySave,
  name,
  address,
  containerStyled,
  disabledSwipe,
  ...rest
}) => {
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      const payload = {
        keySave,
        receiver: {
          name,
          address,
        },
      };
      dispatch(actionDelete(payload));
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  return (
    <Swipeout
      disabled={!!disabledSwipe}
      close
      autoClose
      right={[
        {
          component: <BtnDelete showIcon={false} onPress={onDelete} />,
        },
      ]}
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <TouchableOpacity {...rest}>
        <View style={[itemStyled.hook, containerStyled]}>
          <Text style={itemStyled.name}>{name}</Text>
          <Text
            style={itemStyled.address}
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {address}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeout>
  );
};

Item.defaultProps = {
  containerStyled: null,
  disabledSwipe: true,
};

Item.propTypes = {
  keySave: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  containerStyled: PropTypes.any,
  disabledSwipe: PropTypes.bool,
};

export default Item;
