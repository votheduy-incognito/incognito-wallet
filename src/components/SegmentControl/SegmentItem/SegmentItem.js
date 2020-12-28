import React, {memo} from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '@components/SegmentControl/styles';

const SegmentItem = ({
  index,
  isSelected,
  label,
  onSelected
}) => {
  const onSegmentPress = () => {
    onSelected && onSelected(index);
  };

  return (
    <TouchableOpacity
      onPress={onSegmentPress}
      style={styles.segmentStyle}
    >
      <Text style={[
        styles.labelStyle,
        isSelected
          ? styles.labelSelected
          : styles.labelUnselected
      ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

SegmentItem.propTypes = {
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onSelected: PropTypes.func.isRequired
};


export default memo(SegmentItem);