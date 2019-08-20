import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ScrollView, View, Text, Toast } from '@src/components/core';
import EstimateFee from '@src/components/EstimateFee';
import StakeValidatorTypeSelector from '@src/components/StakeValidatorTypeSelector';
import tokenData from '@src/constants/tokenData';
import { CONSTANT_COMMONS } from '@src/constants';
import LoadingTx from '@src/components/LoadingTx';
import formatUtil from '@src/utils/format';
import styles from './style';

class SelfStaking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStaking: false,
      finalFee: null,
      feeUnit: null,
      amount:  null,
      stakeTypeId: CONSTANT_COMMONS.STAKING_TYPES.SHARD
    };
  }

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

      const { onStaking } = this.props;
      const { stakeTypeId, finalFee } = this.props;
      if (typeof onStaking === 'function') {
        await onStaking({
          stakeType: stakeTypeId,
          fee: finalFee
        });
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
    const { amount, finalFee, feeUnit, stakeTypeId, isStaking } = this.state;
    const { selectedPrivacy } = this.props;
    const toAddress = selectedPrivacy?.paymentAddress;

    return (
      <View>
        <ScrollView>
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
            amount={amount}
            toAddress={toAddress}
            style={styles.estFee}
          />
          <Text style={styles.feeText}>
            You&apos;ll pay: {formatUtil.amount(finalFee, feeUnit === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : null)} {feeUnit}
          </Text>
          <Button title='Stake' style={styles.stakeButton} onPress={this.handleStake} />
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