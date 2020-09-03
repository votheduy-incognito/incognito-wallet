import React from 'react';
import { TouchableOpacity } from '@src/components/core';
import { Image } from 'react-native';
import srcFast from '@src/assets/images/icons/fast.png';
import srcFast2x from '@src/assets/images/icons/fast_2x.png';
import PropTypes from 'prop-types';

const BtnFast = (props) => {
  const { onPress, defaultValue, ...rest } = props;
  const [fast2x, shouldFast2x] = React.useState(
    defaultValue ? defaultValue : false,
  );
  const handlePressBtnFast = async () => {
    const _fast2x = !fast2x;
    shouldFast2x(_fast2x);
    if (typeof onPress === 'function') {
      onPress(_fast2x);
    }
  };
  return (
    <TouchableOpacity onPress={handlePressBtnFast} {...rest}>
      <Image
        source={fast2x ? srcFast2x : srcFast}
        style={{
          width: 40,
          height: 24,
        }}
      />
    </TouchableOpacity>
  );
};

BtnFast.defaultProps = {
  defaultValue: false,
};

BtnFast.propTypes = {
  onPress: PropTypes.func.isRequired,
  defaultValue: PropTypes.bool,
};

export default BtnFast;
