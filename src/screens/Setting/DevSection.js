import React from 'react';
import {Text, TouchableOpacity} from '@components/core/index';
import {pinSection, sectionStyle} from '@screens/Setting/style';
import LocalDatabase from '@utils/LocalDatabase';
import RNRestart from 'react-native-restart';
import SwitchToggle from 'react-native-switch-toggle';
import { COLORS } from '@src/styles';
import { AsyncStorage } from 'react-native';
import Section from './Section';

const DevSection = () => {
  const [homeConfig] = React.useState(global.homeConfig);

  const resetUniswapTooltip = async () => {
    await LocalDatabase.resetViewUniswapTooltip();
    RNRestart.Restart();
  };

  const toggleHomeConfig = async () => {
    await AsyncStorage.setItem('home-config', homeConfig === 'staging' ? 'production' : 'staging');
    RNRestart.Restart();
  };

  const isStagingConfig = homeConfig === 'staging';

  console.debug('HOME CONFIG', homeConfig);

  return (
    <Section
      label="Dev Tools"
      customItems={[
        <TouchableOpacity
          key="home-config"
          onPress={toggleHomeConfig}
          style={[
            sectionStyle.item,
            pinSection.item,
          ]}
        >
          <Text style={pinSection.name}>Use staging home config</Text>
          <SwitchToggle
            containerStyle={pinSection.switch}
            circleStyle={pinSection.circle}
            onPress={toggleHomeConfig}
            switchOn={isStagingConfig}
            backgroundColorOn={COLORS.dark1}
            backgroundColorOff={COLORS.lightGrey5}
            circleColorOff={COLORS.lightGrey1}
            circleColorOn={COLORS.primary}
          />
        </TouchableOpacity>,
        <TouchableOpacity
          key="uniswap-tooltip"
          onPress={resetUniswapTooltip}
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
