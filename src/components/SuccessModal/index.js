import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  RoundCornerButton, Image,
} from '@components/core';
import Row from '@src/components/Row';
import { Overlay } from 'react-native-elements';
import styles from './style';

class SuccessModal extends React.Component {
  render() {
    const {
      visible,
      title,
      description,
      buttonTitle,
      extraInfo,
      closeSuccessDialog,
      buttonStyle,
      onSuccess,
      successTitle,
      icon,
      iconStyle,
    } = this.props;
    return (
      <Overlay isVisible={visible} overlayStyle={styles.dialog}>
        <View style={[styles.dialogContent]}>
          {!!icon && (
            <Image source={icon} style={[styles.icon, iconStyle]} />
          )}
          {!!title && (
            <Text style={styles.dialogTitle}>
              {title}
            </Text>
          )}
          {!!description && (
            <Text style={styles.dialogDesc}>
              {description}
            </Text>
          )}
          {!!extraInfo && (
            <Text style={styles.extraInfo}>
              {extraInfo}
            </Text>
          )}
          {onSuccess ? (
            <Row spaceBetween center style={styles.twoButtonWrapper}>
              <RoundCornerButton
                onPress={closeSuccessDialog}
                title={buttonTitle}
                style={[styles.button, buttonStyle, styles.twoButton]}
              />
              <RoundCornerButton
                onPress={onSuccess}
                title={successTitle}
                style={[styles.button, buttonStyle, styles.twoButton]}
              />
            </Row>
          ) : (
            <RoundCornerButton
              onPress={closeSuccessDialog}
              title={buttonTitle}
              style={[styles.button, buttonStyle]}
            />
          )}
        </View>
      </Overlay>
    );
  }
}

SuccessModal.defaultProps = {
  visible: false,
  buttonTitle: 'OK',
  extraInfo: '',
  buttonStyle: null,
  description: '',
  title: '',
  onSuccess: undefined,
  successTitle: '',
  icon: undefined,
  iconStyle: undefined,
};

SuccessModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  closeSuccessDialog: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  extraInfo: PropTypes.string,
  buttonTitle: PropTypes.string,
  buttonStyle: PropTypes.object,
  successTitle: PropTypes.string,
  icon: PropTypes.string,
  iconStyle: PropTypes.object,
};

export default SuccessModal;
