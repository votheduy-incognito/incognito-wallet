import React from 'react';
import { BackHandler } from 'react-native';
import PropTypes from 'prop-types';

const useBackHandler = (props) => {
  const { onGoBack } = props;
  const backAction = () =>
    typeof onGoBack === 'function' ? onGoBack() : null;
  typeof React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  return null;
};

useBackHandler.propTypes = {
  onGoBack: PropTypes.func.isRequired,
};

export default useBackHandler;
