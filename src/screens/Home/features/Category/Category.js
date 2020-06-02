import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Button from '@screens/Home/features/Button';
import { styled } from './Category.styled';
import withCategory from './Category.enhance';

const Category = props => {
  const { title, buttons, interactionById, isDisabled } = props;
  return (
    <View style={styled.container}>
      <Text style={styled.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      {buttons.map(button => (
        <Button
          {...button}
          key={button?.id}
          disabled={isDisabled(button)}
          onPress={() => interactionById(button)}
        />
      ))}
    </View>
  );
};

Category.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.string.isRequired,
  interactionById: PropTypes.func.isRequired,
  isDisabled: PropTypes.func.isRequired,
};

export default withCategory(Category);
