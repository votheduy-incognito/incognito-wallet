import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CheckedIcon } from '@src/components/Icons';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  btnStyle: {},
});

const BtnBack = (props) => {
  const { btnStyle, onPress, ...rest } = props;
  const [checked, setChecked] = React.useState(false);
  const handlePress = () => {
    const _checked = !checked;
    if (typeof onPress === 'function') {
      onPress(_checked);
    }
    setChecked(_checked);
  };
  return (
    <TouchableOpacity
      style={[styled.btnStyle, btnStyle]}
      onPress={handlePress}
      {...rest}
    >
      <CheckedIcon checked={checked} />
    </TouchableOpacity>
  );
};

BtnBack.defaultProps = {
  btnStyle: null,
  onPress: null,
};

BtnBack.propTypes = {
  btnStyle: PropTypes.any,
  onPress: PropTypes.func,
};

export default BtnBack;
