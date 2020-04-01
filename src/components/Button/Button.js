import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import {commonStyled} from './Button.styled';

const Button = props => {
  const {icon, title, styledContainer, styledTitle} = props;
  return (
    <TouchableOpacity {...props}>
      <View style={[commonStyled.container, styledContainer]}>
        {icon}
        <Text style={[commonStyled.title, styledTitle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  icon: null,
  title: '',
  styledContainer: commonStyled.container,
  styledTitle: commonStyled.title,
};

Button.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  title: PropTypes.string,
  styledContainer: PropTypes.any,
  styledTitle: PropTypes.any,
};

export default Button;
