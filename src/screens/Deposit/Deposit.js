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
    this.handleGenAddress();
  }

  handleGenAddress = () => {
    const { handleGenAddress } = this.props;

    return handleGenAddress()
      .catch(() => {
        this.setState({ hasError: true });
      });
  }

  render() {
    const { depositAddress, selectedPrivacy } = this.props;
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
            <WaitingDeposit selectedPrivacy={selectedPrivacy} depositAddress={depositAddress} />
          </Container>
        </ScrollView>
      )
      :<LoadingContainer />;
  }
}

Deposit.defaultProps = {
  depositAddress: null,
  selectedPrivacy: null,
};

Deposit.propTypes = {
  depositAddress: PropTypes.string,
  selectedPrivacy: PropTypes.object,
  handleGenAddress: PropTypes.func.isRequired,
};

export default Deposit;
