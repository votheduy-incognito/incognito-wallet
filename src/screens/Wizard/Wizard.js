import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Container, Button } from '@src/components/core';
import Base from './Base';
import Indicator from './Indicator';
import styles from './style';


const DEFAULT_INDEX = 0;

class Wizard extends Component {
  constructor() {
    super();

    this.screenData = [
      {
        title: 'Turn on privacy mode',
        desc: 'Send, receive and store your crypto assets with total privacy. No one can view your balances or track your activity.',
        image: require('@src/assets/images/wizard/privacy_mode.png'),
        buttonText: 'Next',
        onPress: this.handleNext,
        buttonStyle: styles.buttonLight,
      },
      {
        title: 'Stake to make crypto',
        desc: 'Manage multiple software or hardware nodes. Start, pause and resume staking. Withdraw your earnings.',
        image: require('@src/assets/images/wizard/stake.png'),
        buttonText: 'Next',
        onPress: this.handleNext,
        buttonStyle: styles.buttonLight,
      },
      {
        title: 'Issue your own token',
        desc: 'Create your own privacy-protecting token with a single tap. How many will you issue? What will you call it?',
        image: require('@src/assets/images/wizard/issue_token.png'),
        buttonText: 'Okay I got it',
        onPress: this.handleFinish,
        buttonStyle: styles.buttonFinish,
      }
    ];

    this.state = {
      currenIndex: DEFAULT_INDEX,
      data: this.screenData[DEFAULT_INDEX]
    };
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
    const { currenIndex } = this.state;
    const { data, newIndex } = this.getData(currenIndex);

    this.setState({ data, currenIndex: newIndex });
  }

  handleFinish = () => {
    const { goHome } = this.props;
    goHome();
  }

  render() {
    const { currenIndex, data } = this.state;

    return (
      <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
        <Container style={styles.container}>
          <Base
            title={data.title}
            desc={data.desc}
            image={data.image}
          />
          <Indicator number={this.screenData.length} activeIndex={currenIndex} style={styles.indicator} />
          <Button title={data.buttonText} onPress={data.onPress} style={[styles.button, data.buttonStyle]} />
        </Container>
      </ScrollView>
    );
  }
}

Wizard.propTypes = {
  goHome: PropTypes.func.isRequired
};

export default Wizard;
