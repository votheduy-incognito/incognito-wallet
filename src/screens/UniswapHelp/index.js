import React from 'react';
import { ScrollView } from '@src/components/core';
import Question from '@components/HelpScreen/Question';
import styles from './style';

const questions = [
  {
    text: 'How does pKyber work?',
    answer: 'pKyber allows you to trade using Kyber liquidity pools. The only difference is that everything is anonymous.',
  },
  {
    text: 'Is this version on the mainnet?',
    answer: 'pKyber is currently on the testnet. The mainnet launch is scheduled for mid May 2020.',
  },
  {
    text: 'How do I get started?',
    answer: 'Testnet pETH (privacy ETH)  will be released to you the first time you open pKyber. This may take a couple of minutes. Once you receive them, you’re good to go! Trade your pETH for any currency listed.',
  },
  {
    text: 'How do I withdraw?',
    answer: 'pKyber testnet tokens cannot be withdrawn to another account.'
  },
  {
    text: 'How is pKyber different from the Trade feature in the wallet?',
    answer: 'pKyber taps into Kyber liquidity. Essentially – you’re trading on Kyber, just that everything is private.  Trade gives you access to liquidity pools on the Incognito privacy DEX.',
  },
];

const UniswapHelp = () => {
  return (
    <ScrollView style={styles.container}>
      {questions.map(item => (
        <Question {...item} />
      ))}
    </ScrollView>
  );
};

export default React.memo(UniswapHelp);
