import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { BtnCircleBack } from '@components/Button';

const BackButton = ({ onPress, navigation }) => {
  const back = () => navigation?.pop();

  return (
    <BtnCircleBack onPress={onPress || back} />
  );
};

BackButton.propTypes = {
  onPress: PropTypes.func,
  navigation: PropTypes.object.isRequired
};

BackButton.defaultProps = {
  onPress: null
};

export default withNavigation(BackButton);
