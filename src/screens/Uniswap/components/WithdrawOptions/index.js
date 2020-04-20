import React  from 'react';
import PropTypes from 'prop-types';
import MultiStepsModal from '@components/MultiStepsModal/index';

const WithdrawalOptions = ({ onClose, visible, onWithdraw, onWithdrawPDEX }) => (
  <MultiStepsModal
    visible={visible}
    onClose={onClose}
    steps={[
      {
        title: 'Step 1:',
        description: 'Withdraw to pDEX account.',
        action: 'Withdraw to pDEX account',
        onPress: onWithdrawPDEX,
      },
      {
        title: 'Step 2:',
        description: 'Withdraw from pDEX account to your wallet account..',
        action: 'Withdraw to wallet account',
        onPress: onWithdraw,
      }
    ]}
  />
);

WithdrawalOptions.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onWithdraw: PropTypes.func.isRequired,
  onWithdrawPDEX: PropTypes.func.isRequired,
};

export default WithdrawalOptions;
