import React, { memo } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import lightningIcon from '@assets/images/icons/lightning.png';
import styles from './styles';

const PriorityItem = ({ data, selected, onSelected }) => {

  const renderLightningImage = () => {
    const listImage = [];
    for (let index = 0; index < data?.number; index++) {
      listImage.push(
        <Image
          key={data?.key + index}
          style={[styles.lightningIcon, selected && styles.lightningSelected]}
          source={lightningIcon}
        />
      );
    }
    return listImage;
  };

  const onPress =() => {
    onSelected && onSelected(data?.key);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.wrapperItem, selected && styles.itemSelected]}
      onPress={onPress}
    >
      {renderLightningImage()}
    </TouchableOpacity>
  );
};

PriorityItem.propTypes = {
  data: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelected: PropTypes.func.isRequired,
};


export default memo(PriorityItem);