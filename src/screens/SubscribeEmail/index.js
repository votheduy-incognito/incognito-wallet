import React, { Component } from 'react';
import SubscribeEmail from './SubscribeEmail';
import { subscribeEmail } from '@src/services/api/user';
import { Toast } from '@src/components/core';

class SubscribeEmailContainer extends Component {
  handleSubscribe = async values => {
    try {
      if (!values?.email) return;

      const data = await subscribeEmail(values?.email);
      Toast.showInfo('Your email was subscribed');
      return data;
    } catch (e) {
      Toast.showError(e.message || 'Can not subscribe your email, please try again');
    } 
  }

  render() {
    return <SubscribeEmail onSubscribe={this.handleSubscribe} />;
  }
}

export default SubscribeEmailContainer;