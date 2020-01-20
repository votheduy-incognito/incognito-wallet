import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, Button } from '@src/components/core';
import Icons from 'react-native-vector-icons/AntDesign';
import LoadingContainer from '@src/components/LoadingContainer';
import SimpleInfo from '@src/components/SimpleInfo';
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
    const { handleGenAddress, handleGetMinMaxAmount } = this.props;

    return Promise.all([handleGenAddress(), handleGetMinMaxAmount()])
      .catch(() => {
        this.setState({ hasError: true });
      });
  }

  render() {
    const { depositAddress, selectedPrivacy, min, max } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <SimpleInfo
          icon={<Icons name='exclamationcircleo' style={style.errorIcon} />}
          type='success'
          text='Sorry, we can not process your deposit request right now, please try again.'
          subText='If this problem still happening, please come back after 60 minutes.'
          button={
            <Button title='Try again' onPress={this.handleGenAddress} isAsync />
          }
        />
      );
    }

    return depositAddress ?
      (
        <ScrollView style={style.container}>
          <Container style={style.mainContainer}>
            <WaitingDeposit selectedPrivacy={selectedPrivacy} depositAddress={depositAddress} min={min} max={max} />
          </Container>
        </ScrollView>
      )
      :<LoadingContainer />;
  }
}

Deposit.defaultProps = {
  depositAddress: null,
  selectedPrivacy: null,
  min: null,
  max: null
};

Deposit.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  depositAddress: PropTypes.string,
  selectedPrivacy: PropTypes.object,
  handleGenAddress: PropTypes.func.isRequired,
  handleGetMinMaxAmount: PropTypes.func.isRequired,
};

export default Deposit;
