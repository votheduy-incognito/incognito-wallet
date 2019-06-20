import { Toast } from '@src/components/core';
// import { subscribeEmail } from '@src/services/api/user';
import React, { Component } from 'react';
import SubscribeEmail from './SubscribeEmail';

class SubscribeEmailContainer extends Component {
  handleSubscribe = async values => {
    try {
      if (!values?.email) return;

      // const data = await subscribeEmail(values?.email);
      const data = undefined;
      Toast.showInfo('Your email was subscribed');
      return data;
    } catch (e) {
      Toast.showError(
        e.message || 'Can not subscribe your email, please try again'
      );
    }
  };

  render() {
    return <SubscribeEmail onSubscribe={this.handleSubscribe} />;
  }
}

export default SubscribeEmailContainer;
