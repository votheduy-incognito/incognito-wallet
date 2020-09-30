import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, Image } from '@components/core';
import theme from '@src/styles/theme';
import minus from '@src/assets/images/node/minus.png';
import plus from '@src/assets/images/node/plus.png';

const Quantity = ({ quantity, onChangeQuantity }) => {
  const handleIncreaseQuantity = () => {
    if (quantity + 1 <= 5) {
      onChangeQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity - 1 > 0) {
      onChangeQuantity(quantity - 1);
    }
  };

  const disabledDecrease = quantity === 1;
  const disabledIncrease = quantity === 5;

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent:'center', alignItems: 'center'}}>
      <Text style={[theme.text.boldTextStyleMedium]}>Quantity</Text>
      <View style={[theme.FLEX.rowSpaceBetween]}>
        <View style={[theme.FLEX.rowSpaceBetween, {justifyContent: 'center', alignItems: 'center'}]}>
          <TouchableOpacity
            style={{ opacity: disabledDecrease ? 0.5 : 1, marginRight: 10 }}
            disabled={disabledDecrease}
            onPress={handleDecreaseQuantity}
          >
            <Image source={minus} />
          </TouchableOpacity>
          <Text style={[theme.text.boldTextStyleMedium, { marginRight: 10 }]}>{`${quantity < 10 ? `0${quantity}` : `${quantity}`}`}</Text>
          <TouchableOpacity
            style={{ opacity: disabledIncrease ? 0.5 : 1 }}
            disabled={disabledIncrease}
            onPress={handleIncreaseQuantity}
          >
            <Image source={plus} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

Quantity.propTypes = {
  quantity: PropTypes.number.isRequired,
  onChangeQuantity: PropTypes.func.isRequired,
};

export default Quantity;
