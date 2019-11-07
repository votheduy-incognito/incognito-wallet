import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getPrivacyDataByTokenID } from '@src/redux/selectors/selectedPrivacy';
import { getAccountByName, listAccount, defaultAccount } from '@src/redux/selectors/account';
import accountService from '@src/services/wallet/accountService';
import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler, CustomError,ErrorCode } from '@src/services/exception';
import _ from 'lodash';
import { logEvent } from '@src/services/firebase';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import SelfStaking from './SelfStaking';

const TAG = 'SelfStakingContainer';
export class SelfStakingContainer extends Component {
  constructor(props) {
    super(props);
    const {navigation} = props;
    const { params = {} } = navigation?.state??{};
    const accountInfo = params?.accountInfo??{};
    
    this.state = {
      minerAccountName:accountInfo.minerAccountName, 
      funderAccountName:accountInfo.funderAccountName
    };
  }

  handleStaking = async ({ stakeType, fee, funderAccount, minerAccount }) => {
    const candidatePaymentAddress = minerAccount?.PaymentAddress??'';
    try {
      const { wallet } = this.props;
      const param = {
        type: Number(stakeType),
      };
      // param, fee, candidatePaymentAddress, account, wallet, rewardReceiverPaymentAddress, autoReStaking = false
      
      logEvent(CONSTANT_COMMONS.TRACK_LOG_EVENT.CLICK_STAKING,{candidatePaymentAddress:candidatePaymentAddress,fee:fee,stakeType:stakeType,status:CONSTANT_COMMONS.TRACK_LOG_EVENT_STATUS.BEGIN});
      if(_.isEmpty(candidatePaymentAddress)) new ExHandler(new CustomError(ErrorCode.payment_address_empty),'Candidate PaymentAddress is empty').showErrorToast().throw();
      
      const rs = await accountService.staking(param, fee, candidatePaymentAddress,funderAccount, wallet,candidatePaymentAddress,true);

      // logEvent(CONSTANT_COMMONS.TRACK_LOG_EVENT.CLICK_STAKING,{candidatePaymentAddress:candidatePaymentAddress,status:CONSTANT_COMMONS.TRACK_LOG_EVENT_STATUS.PASS});
      return rs;
    } catch (e) {
      
      logEvent(CONSTANT_COMMONS.TRACK_LOG_EVENT.CLICK_STAKING,{candidatePaymentAddress:candidatePaymentAddress,status:CONSTANT_COMMONS.TRACK_LOG_EVENT_STATUS.FAIL,errorMessage:e.message??''});
      throw new CustomError(ErrorCode.click_stake,{rawError:e}) ;
    }
  }

  getSelectedPrivacy =()=>{
    const { getPrivacyDataByTokenID } = this.props;
    
    if(_.isEmpty(this.selectedPrivacy)){
      this.selectedPrivacy = getPrivacyDataByTokenID(CONSTANT_COMMONS.PRV_TOKEN_ID);
    }
    return this.selectedPrivacy;
  }

  render() {
    
    // debugger;
    const selectedPrivacy = this.getSelectedPrivacy();
    if (!selectedPrivacy) return null;
    const {funderAccountName,minerAccountName} = this.state;
    

    return (
      <SelfStaking
        {...this.props}
        funderAccountName={funderAccountName}
        minerAccountName={minerAccountName}
        selectedPrivacy={selectedPrivacy}
        onStaking={this.handleStaking}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  getPrivacyDataByTokenID: getPrivacyDataByTokenID(state),
  wallet: state?.wallet,
  getAccountByName: getAccountByName(state),
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
