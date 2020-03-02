import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, Button} from '@components/core';
import Icons from 'react-native-vector-icons/AntDesign';
import LoadingContainer from '@components/LoadingContainer';
import SimpleInfo from '@components/SimpleInfo';
import withLayout from '@components/Layout/index';
import WaitingDeposit from './WaitingDeposit';
import style from './style';

class Deposit extends React.Component {
  constructor() {
    super();

    this.state = {
      hasError: false,
    };
  }

  componentDidMount() {
    this.handleGetData();
  }

  handleGetData = () => {
    const {handleGenAddress, handleGetMinMaxAmount} = this.props;

    return Promise.all([handleGenAddress(), handleGetMinMaxAmount()]).catch(
      () => {
        this.setState({hasError: true});
      },
    );
  };

  render() {
    const {depositAddress, selectedPrivacy, min, max, amount} = this.props;
    const {hasError} = this.state;

    if (hasError) {
      return (
        <SimpleInfo
          icon={<Icons name="exclamationcircleo" style={style.errorIcon} />}
          type="success"
          text="Sorry, we can not process your deposit request right now, please try again."
          subText="If this problem still happening, please come back after 60 minutes."
          button={
            <Button title="Try again" onPress={this.handleGenAddress} isAsync />
          }
        />
      );
    }

    return depositAddress ? (
      <ScrollView style={style.container}>
        <WaitingDeposit
          selectedPrivacy={selectedPrivacy}
          depositAddress={depositAddress}
          min={min}
          max={max}
          amount={amount}
        />
      </ScrollView>
    ) : (
      <LoadingContainer />
    );
  }
}

Deposit.defaultProps = {
  depositAddress: null,
  selectedPrivacy: null,
  min: null,
  max: null,
  amount: 0,
};

Deposit.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  depositAddress: PropTypes.string,
  selectedPrivacy: PropTypes.object,
  handleGenAddress: PropTypes.func.isRequired,
  handleGetMinMaxAmount: PropTypes.func.isRequired,
  amount: PropTypes.number,
};

export default Deposit;
