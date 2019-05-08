import React from 'react';
import SeedPhrase from './SeedPhrase';

const SeedPhraseContainer = ({ navigation }) => {
  const seedPhrase = navigation?.getParam('seedPhrase');
  return <SeedPhrase seedPhrase={seedPhrase} />;
};

export default SeedPhraseContainer;