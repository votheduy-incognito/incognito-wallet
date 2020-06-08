import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { Container, ScrollView } from '@src/components/core';
import { UTILS } from '@src/styles';
import WizardAnim from '@src/components/core/WizardComponent';
import Base from './Base';
import styles from './style';

class Wizard extends Component {
  constructor() {
    super();

    this.scroll = React.createRef();

    this.screenData = [
      {
        index: 0,
        title: 'Turn on privacy mode',
        desc: 'Send, receive and store your crypto assets with total privacy. No one can view your balances or track your activity. ',
        image: require('@src/assets/images/wizard/privacy_mode.png'),
        buttonText: 'Next',
        onPress: this.handleNext,
        buttonStyle: styles.buttonLight,
      },
      {
        index: 1,
        title: 'Stake to make crypto',
        desc: 'Manage multiple software or hardware nodes. Start, pause and resume staking. Withdraw your earnings.',
        image: require('@src/assets/images/wizard/stake.png'),
        buttonText: 'Next',
        onPress: this.handleNext,
        buttonStyle: styles.buttonLight,
      },
      {
        index: 2,
        title: 'Issue your own privacy coin',
        desc: 'Create your own privacy-protecting coin with a single tap. How many will you invent? What will you call it?',
        image: require('@src/assets/images/wizard/issue_token.png'),
        buttonText: 'Okay I got it',
        onPress: this.handleFinish,
        buttonStyle: styles.buttonFinish,
      }
    ];

    this.currentPositionX = 0;
    this.onScroll = debounce(this.onScroll.bind(this), 100);
  }

  getData = currenIndex => {
    let newIndex = currenIndex + 1;
    const data = this.screenData[newIndex];

    if (data) {
      return { data, newIndex };
    }

    newIndex = 0;
    return { data: this.screenData[newIndex], newIndex };
  }

  handleNext = () => {
    this.scroll.current?.scrollTo({
      x: this.currentPositionX + UTILS.deviceWidth(),
    });
  }

  handleFinish = () => {
    const { goHome } = this.props;
    goHome();
  }

  onScroll = (e) => {
    this.currentPositionX = e?.nativeEvent?.contentOffset?.x;
  }

  render() {
    return (
      <WizardAnim onAnimationFinish={()=>this.handleFinish()} />
    );
  }
}

Wizard.propTypes = {
  goHome: PropTypes.func.isRequired
};

export default Wizard;
