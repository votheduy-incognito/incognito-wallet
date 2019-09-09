import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { Container, ScrollView } from '@src/components/core';
import { UTILS } from '@src/styles';
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
        title: 'Issue your own token',
        desc: 'Create your own privacy-protecting token with a single tap. How many will you issue? What will you call it?',
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
      <ScrollView
        pagingEnabled
        horizontal
        ref={this.scroll}
        onScroll={
          e => {
            e.persist();
            this.onScroll(e);
          }
        }
      >
        {
          this.screenData.map(data => (
            <ScrollView key={data.index} contentContainerStyle={{ minHeight: '100%' }}>
              <Container style={styles.container}>
                <Base
                  indicator={data.index}
                  indicatorNumber={this.screenData.length}
                  title={data.title}
                  desc={data.desc}
                  image={data.image}
                  buttonText={data.buttonText}
                  buttonStyle={data.buttonStyle}
                  onPress={data.onPress}
                />
              </Container>
            </ScrollView>
          ))
        }
        
      </ScrollView>
    );
  }
}

Wizard.propTypes = {
  goHome: PropTypes.func.isRequired
};

export default Wizard;
