import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text, View } from '@components/core';
import theme from '@src/styles/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import routeNames from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import Row from '@components/Row';

const Select = ({ items, item, onSelect, placeholder, textPlaceholder }) => {
  const navigation = useNavigation();
  const showSelectCoinScreen = () => {
    navigation.navigate(routeNames.ItemSelectScreen, {
      onSelect: onSelect,
      items,
      placeholder,
    });
  };

  return (
    <TouchableOpacity onPress={showSelectCoinScreen}>
      <Row spaceBetween center>
        { !!item && <Text style={[theme.text.boldTextStyleMedium]}>{item}</Text> }
        { !item && <Text style={[theme.text.mediumTextMotto]}>{textPlaceholder}</Text> }
        <AntDesign name="right" size={18} />
      </Row>
    </TouchableOpacity>
  );
};

Select.propTypes = {
  onSelect: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  item: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  textPlaceholder: PropTypes.string,
};

Select.defaultProps = {
  placeholder: 'Search',
  textPlaceholder: '',
};

export default Select;
