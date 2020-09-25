import PropTypes from 'prop-types';
import React from 'react';
import { SuccessModal } from '@src/components';
import theme from '@src/styles/theme';

export const BackUpAccountModal = ({ visible, onClose }) => (
  <SuccessModal
    visible={visible}
    closeSuccessDialog={onClose}
    title="Keep your Node safe."
    extraInfo="A keychain has been created for you. Remember to copy your private key and keep it somewhere safe."
    buttonStyle={[theme.BUTTON.NODE_BUTTON]}
  />
);

BackUpAccountModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
