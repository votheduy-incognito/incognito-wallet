import PropTypes from 'prop-types';
import { CheckBox as RNCheckBox } from 'react-native-elements';

const CheckBox = RNCheckBox;

CheckBox.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.objectOf(PropTypes.object),
  containerStyle: PropTypes.objectOf(PropTypes.object)
};

export default CheckBox;
