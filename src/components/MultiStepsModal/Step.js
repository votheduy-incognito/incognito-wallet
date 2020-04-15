import React  from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Button,
} from '@src/components/core';
import {stepStyles} from './style';

const Step = ({title, description, action, onPress, lastStep}) => (
  <View style={[stepStyles.step]}>
    <Text style={stepStyles.title}>{title}</Text>
    <Text style={stepStyles.description}>{description}</Text>
    <Button onPress={onPress} title={action} style={stepStyles.action} />
    {!lastStep && <View style={stepStyles.divider} />}
  </View>
);

Step.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  lastStep: PropTypes.bool,
};

Step.defaultProps = {
  title: '',
  description: '',
  lastStep: false,
};

export default Step;
