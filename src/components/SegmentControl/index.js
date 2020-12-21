import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import SegmentItem from '@components/SegmentControl/SegmentItem/SegmentItem';
import { styles } from './styles';

const SegmentControl = ({
  values,
  selectedIndex,
  onChange,
  style
}) => {

  const onSelected = (index) => {
    if (index === selectedIndex) return;
    onChange && onChange(index);
  };

  const renderItem = (item, index) => (
    <SegmentItem
      key={item + index}
      index={index}
      label={item}
      isSelected={index === selectedIndex}
      onSelected={onSelected}
    />
  );

  return (
    <View style={[styles.container, style]}>
      {values.map(renderItem)}
    </View>
  );
};

SegmentControl.propTypes = {
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number,
  style: PropTypes.object
};

SegmentControl.defaultProps = {
  selectedIndex: 0,
  style: null
};

export default memo(SegmentControl);