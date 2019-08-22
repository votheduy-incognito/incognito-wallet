import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ScrollView, View, Text, Toast, Picker } from '@src/components/core';
import EstimateFee from '@src/components/EstimateFee';
import StakeValidatorTypeSelector from '@src/components/StakeValidatorTypeSelector';
import tokenData from '@src/constants/tokenData';
import { CONSTANT_COMMONS } from '@src/constants';
import LoadingTx from '@src/components/LoadingTx';
import formatUtil from '@src/utils/format';
import convertUtil from '@src/utils/convert';
import styles from './style';

class SelfStaking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStaking: false,
      finalFee: null,
      feeUnit: null,
      amount:  null,
      stakeTypeId: CONSTANT_COMMONS.STAKING_TYPES.SHARD,
      funderAccountName: null,
      funderAccount: null,
      minerAccount: null,
    };
  }

  componentDidMount() {
    const { defaultAccountName } = this.props;
    this.setDefaultFunderAccountName(defaultAccountName);
  }

  setDefaultFunderAccountName = name => this.setState({ funderAccountName: name });

  static getDerivedStateFromProps(nextProps, nextState) {
    let state = {};
    const { getAccountByName, minerAccountName } = nextProps;
    const { funderAccountName } = nextState;
    if (getAccountByName && minerAccountName) {
      state = {
        ...state,
        minerAccount: getAccountByName(minerAccountName)
      };
    }

    if (getAccountByName && funderAccountName) {
      state = {
        ...state,
        funderAccount: getAccountByName(funderAccountName)
      };
    }

    return state;
  }

  handleSelectFee = ({ fee, feeUnit }) => {
    this.setState({ finalFee: fee, feeUnit });
  }

  handleStakeTypeChange = ({ id, amount }) => {
    this.setState({ stakeTypeId: id, amount });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation?.pop();
  }

  handleStake = async () => {
    try {
      this.setState({
        isStaking: true
      });

      const { onStaking, getAccountByName } = this.props;
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
          this.goBack();
        } else {
          throw new Error('Stake failed with no tx id');
        }
      }
    } catch {
      Toast.showError('Stake failed, please try again');
    } finally {
      this.setState({
        isStaking: false
      });
    }
  }

  render() {
    const { amount, finalFee, feeUnit, stakeTypeId, isStaking, funderAccountName, minerAccount, funderAccount } = this.state;
    const { selectedPrivacy, listAccount } = this.props;
    const toAddress = minerAccount?.paymentAddress || selectedPrivacy?.paymentAddress;
    const isNotEnoughBalance = amount > funderAccount?.value;
    const isCanSubmit = !isNotEnoughBalance;

    return (
      <View>
        <ScrollView>
          <View style={styles.selectFunder}>
            <Text style={styles.selectFunderLabel}>Select funder account</Text>
            <Picker
              selectedValue={funderAccountName}
              style={styles.selectFunderPicker}
              onValueChange={(itemValue) => this.setState({ funderAccountName: itemValue })}
            >
              {
                listAccount?.map(account => (
                  <Picker.Item
                    key={account?.name}
                    label={`${account?.name} (${formatUtil.amount(account?.value, CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY)} ${CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV})`}
                    value={account?.name}
                  />
                ))
              }
            </Picker>
            {
              isNotEnoughBalance && <Text style={styles.selectFunderErrText}>This funder account is not enough balance for staking, please select another account</Text>
            }
          </View>
          <StakeValidatorTypeSelector
            stakeTypeId={stakeTypeId}
            onChange={this.handleStakeTypeChange}
            style={styles.stakeSelector}
          />
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
            You&apos;ll pay: {formatUtil.amount(finalFee, feeUnit === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : null)} {feeUnit}
          </Text>
          <Button disabled={!isCanSubmit} title='Stake' style={styles.stakeButton} onPress={this.handleStake} />
        </ScrollView>
        { isStaking && <LoadingTx /> }
      </View>
    );
  }
}

SelfStaking.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired
};

export default SelfStaking;