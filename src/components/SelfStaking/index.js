import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectedPrivacy } from '@src/redux/selectors/selectedPrivacy';
import { getAccountByName } from '@src/redux/selectors/account';
import accountService from '@src/services/wallet/accountService';
import { CONSTANT_COMMONS } from '@src/constants';
import SelfStaking from './SelfStaking';

export class SelfStakingContainer extends Component {
  handleStaking = async ({ stakeType, fee }) => {
    try {
      const { wallet, accountName, getAccountByName } = this.props;
      const account = getAccountByName(accountName);
      const param = {
        type: Number(stakeType),
        burningAddress: CONSTANT_COMMONS.STAKING_ADDRESS
      };
      const candidatePaymentAddress = null;
      const isRewardFunder = false; // reward will be paid for miners

      const rs = await accountService.staking(param, fee, candidatePaymentAddress, isRewardFunder, account, wallet);

      return rs;
    } catch (e) {
      throw e;
    }
  }

  render() {
    const { selectedPrivacy, accountName, getAccountByName } = this.props;

    if (!selectedPrivacy || !getAccountByName(accountName)) return null;

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
});

const mapDispatchToProps = {
  
};


SelfStakingContainer.defaultProps = {
  accountName: null,
  selectedPrivacy: null
};

SelfStakingContainer.propTypes = {
  accountName: PropTypes.string,
  selectedPrivacy: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(SelfStakingContainer);
