import React from 'react';
import {Text, TouchableOpacity} from '@components/core/index';
import {pinSection, sectionStyle} from '@screens/Setting/style';
import LocalDatabase from '@utils/LocalDatabase';
import RNRestart from 'react-native-restart';
import Section from './Section';

const DevSection = () => {
  const resetUniswapTooltip = async () => {
    await LocalDatabase.resetViewUniswapTooltip();
    RNRestart.Restart();
  };

  const resetUniswapAirdrop = async () => {
    await LocalDatabase.resetUniswapAirdrop();
    RNRestart.Restart();
  };

  return (
    <Section
      label="Dev Tools"
      customItems={[
        <TouchableOpacity
          key="uniswap-tooltip"
          onPress={resetUniswapTooltip}
          activeOpacity={0.5}
          style={[
            sectionStyle.item,
            pinSection.item,
          ]}
        >
          <Text style={pinSection.name}>Reset uniswap airdrop</Text>
        </TouchableOpacity>,
        <TouchableOpacity
          key="uniswap-airdrop"
          onPress={resetUniswapAirdrop}
          activeOpacity={0.5}
          style={[
            sectionStyle.item,
            pinSection.item,
          ]}
        >
          <Text style={pinSection.name}>Reset uniswap tooltip</Text>
        </TouchableOpacity>
      ]}
    />
  );
};

DevSection.propTypes = {};

export default DevSection;
