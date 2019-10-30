import warningImg from '@src/assets/images/incognito_warning.png';
import { Button, Image, ScrollView, Text, Toast, View } from '@src/components/core';
import EstimateFee from '@src/components/EstimateFee';
import LoadingTx from '@src/components/LoadingTx';
import StakeValidatorTypeSelector from '@src/components/StakeValidatorTypeSelector';
import { CONSTANT_COMMONS } from '@src/constants';
import tokenData from '@src/constants/tokenData';
import { ExHandler, CustomError, ErrorCode } from '@src/services/exception';
import convertUtil from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BaseScreen from '@src/screens/BaseScreen';
import _ from 'lodash';
import styles from './style';

const TAG  = 'SelfStaking';
class SelfStaking extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      isStaking: false,
      finalFee: null,
      feeUnit: null,
      amount:  null,
      stakeTypeId: CONSTANT_COMMONS.STAKING_TYPES.SHARD,
      funderAccount: null,
      minerAccount: null,
    };
  }

  static getDerivedStateFromProps(nextProps,prevState) {
  
    const { getAccountByName, minerAccountName, funderAccountName } = nextProps;
    const {funderAccount,minerAccount} = prevState;
    if (getAccountByName) {
      if(!_.isEqual(minerAccount?.name,minerAccountName)){
        return {
          minerAccount: getAccountByName(minerAccountName || funderAccountName)
        };
      }

      if(!_.isEqual(funderAccount?.name,funderAccountName)){
        return {
          funderAccount: getAccountByName(funderAccountName)
        };
      }
      
    }
    return null;
  }
  onResume = ()=>{
    const { funderAccount } = this.state;
    const { getAccountByName, minerAccountName, funderAccountName } = this.props;
    if (getAccountByName) {
      this.setState({
        minerAccount: getAccountByName(minerAccountName || funderAccountName),
        funderAccount: getAccountByName(funderAccountName)

      });
      
    }
    // if (!funderAccount) {
    //   console.log(TAG,'onResume null');
    //   this.onPressBack();
    // }
  }


  // componentDidUpdate() {
  //   const { funderAccount } = this.state;
  //   const { navigation, funderAccountName } = this.props;
  //
  //   if (!funderAccount) {
  //     console.log('Navigation go back', navigation.state.params);
  //     navigation?.goBack(navigation.state.params.goBackKey);
  //   }
  // }

  handleSelectFee = ({ fee, feeUnit }) => {
    this.setState({ finalFee: fee, feeUnit });
  }

  handleStakeTypeChange = ({ id, amount }) => {
    this.setState({ stakeTypeId: id, amount });
  }

  handleStake = async () => {
    try {
      this.setState({
        isStaking: true
      });

      const { onStaking, getAccountByName,onCallBackStaked } = this.props;
      const { stakeTypeId, finalFee, minerAccount, funderAccount } = this.state;
      if (typeof onStaking === 'function') {
        const rs = await onStaking({
          stakeType: stakeTypeId,
          fee: finalFee,
          minerAccount,
          funderAccount
        });

        if (rs?.txId) {
          Toast.showInfo('Stake completed!');
          if(onCallBackStaked instanceof Function ){ 
            onCallBackStaked(rs);
          }
        } else {
          new ExHandler(new CustomError(ErrorCode.click_stake), 'Stake failed with no tx id').showErrorToast();
        }
      }
    } catch (e) {
      new ExHandler(new CustomError(ErrorCode.click_stake,{rawError:e}), 'Stake failed, please try again').showErrorToast();
    } finally {
      this.setState({
        isStaking: false
      });
    }
  }

  render() {
    const { amount, finalFee, feeUnit, stakeTypeId, isStaking, minerAccount, funderAccount } = this.state;
    const { selectedPrivacy } = this.props;
    const toAddress = minerAccount?.paymentAddress || selectedPrivacy?.paymentAddress;
    const isCantLoadAccount =  _.isEmpty(funderAccount) || _.isNil(funderAccount?.value) ||_.isNaN(funderAccount?.value);
    const isNotEnoughBalance = isCantLoadAccount || amount > funderAccount?.value;
    const isCanSubmit = !isNotEnoughBalance;

    return (
      <ScrollView>
        {isCantLoadAccount &&(
          <View style={styles.notEnoughPRVContainer}>
            <Image source={warningImg} style={styles.notEnoughPRVCImg} />
            <Text style={styles.notEnoughPRVText}>Can not load account</Text>
          </View>
        )}
        {
          !isCantLoadAccount && isNotEnoughBalance && (
            <View style={styles.notEnoughPRVContainer}>
              <Image source={warningImg} style={styles.notEnoughPRVCImg} />
              <Text style={styles.notEnoughPRVText}>Please top up PRV</Text>
            </View>
          )
        }
        {!isCantLoadAccount &&(
          <StakeValidatorTypeSelector
            isNotEnoughBalance={isNotEnoughBalance}
            account={funderAccount}
            stakeTypeId={stakeTypeId}
            onChange={this.handleStakeTypeChange}
            style={styles.stakeSelector}
          />
        )}
        {
          !isCantLoadAccount && !isNotEnoughBalance && (
            <>
              <EstimateFee
                initialFee={0}
                finalFee={finalFee}
                onSelectFee={this.handleSelectFee}
                types={[tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY]}
                amount={convertUtil.toHumanAmount(amount, CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY)}
                toAddress={toAddress}
                style={styles.estFee}
              />
              <Text style={styles.feeText}>
                You&apos;ll pay: {formatUtil.amountFull(finalFee, feeUnit === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : null)} {feeUnit}
              </Text>
              <Button disabled={!isCanSubmit} title='Stake' style={styles.stakeButton} onPress={this.handleStake} />
            </>
          )
        }
        { isStaking && <LoadingTx /> }
      </ScrollView>
    );
  }
}

SelfStaking.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired
};

export default SelfStaking;