import React, { Component } from 'react';
import { CONSTANT_COMMONS } from '@src/constants';
import { getStakingAmount } from '@src/services/wallet/RpcClientService';
import StakeValidatorTypeSelector from './StakeValidatorTypeSelector';
import { Toast, View } from '../core';
import ActivityIndicator from '../core/ActivityIndicator/Component';

const DEFAULT_STAKE_DATA = [
  {
    id: CONSTANT_COMMONS.STAKING_TYPES.SHARD,
    name: 'Shard validator',
    amount: null
  },
  {
    id: CONSTANT_COMMONS.STAKING_TYPES.BEACON,
    name: 'Beacon validator',
    amount: null
  }
];

class StakeValidatorTypeSelectorContainer extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      stakeData: null
    };
  }

  componentWillMount() {
    this.getStakingAmount()
      .then(newData => this.setState({ stakeData: newData }));
  }

  getStakingAmount = async () => {
    try {
      this.setState({ isLoading: true });

      const promises = DEFAULT_STAKE_DATA.map(type => getStakingAmount(type.id));

      const amounts =  await Promise.all(promises);

      const newStakeData = DEFAULT_STAKE_DATA.map((stake, index) => ({
        ...stake,
        amount: amounts[index]
      }));

      return newStakeData;
    } catch {
      Toast.showError('Get staking data failed, please try later');
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { stakeData, isLoading } = this.state;

    if (isLoading || !stakeData) return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator />
      </View>
    );

    return (
      <StakeValidatorTypeSelector {...this.props} stakeData={stakeData} />
    );
  }
}

export default StakeValidatorTypeSelectorContainer;