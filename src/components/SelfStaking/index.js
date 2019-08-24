import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectedPrivacy } from '@src/redux/selectors/selectedPrivacy';
import { getAccountByName, listAccount, defaultAccount } from '@src/redux/selectors/account';
import accountService from '@src/services/wallet/accountService';
import { CONSTANT_COMMONS } from '@src/constants';
import SelfStaking from './SelfStaking';

export class SelfStakingContainer extends Component {
  handleStaking = async ({ stakeType, fee, funderAccount, minerAccount }) => {
    try {
      const { wallet } = this.props;
      const param = {
        type: Number(stakeType),
      };
      const candidatePaymentAddress = minerAccount?.PaymentAddress;
      const isRewardFunder = false; // reward will be paid for miners
      const rs = await accountService.staking(param, fee, candidatePaymentAddress, isRewardFunder, funderAccount, wallet);

      return rs;
    } catch (e) {
      throw e;
    }
  }

  render() {
    const { selectedPrivacy } = this.props;

    if (!selectedPrivacy) return null;

    return (
      <SelfStaking
        {...this.props}
        onStaking={this.handleStaking}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  selectedPrivacy: selectedPrivacy(state),
  wallet: state?.wallet,
  getAccountByName: getAccountByName(state),
  listAccount: listAccount(state),
  defaultAccountName: defaultAccount(state)?.name
});

const mapDispatchToProps = {
  
};


SelfStakingContainer.defaultProps = {
  minerAccountName: null,
  funderAccountName:null,
  selectedPrivacy: null,
  onCallBackStaked:null
};

SelfStakingContainer.propTypes = {
  minerAccountName: PropTypes.string,
  funderAccountName: PropTypes.string,
  selectedPrivacy: PropTypes.object,
  onCallBackStaked:PropTypes.func
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(SelfStakingContainer);
