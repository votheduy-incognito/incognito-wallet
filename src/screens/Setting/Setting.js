import {ScrollView, Text, TouchableOpacity, View} from '@src/components/core';
import {getPassphrase} from '@src/services/wallet/passwordService';
import PropTypes from 'prop-types';
import React from 'react';
import LocalDatabase from '@utils/LocalDatabase';
import Device from '@models/device';
import PINSection from '@screens/Setting/PINSection';
import BackupHeaderBtn from '@src/components/HeaderRight/Backup';
import SeparatorSection from '@screens/Setting/SeparatorSection';
import AppUpdater from '@components/AppUpdater/index';
import AccountSection from './AccountSection';
import NetworkSection from './NetworkSection';
import {settingStyle} from './style';
import FrequentReceiverSection from './FrequentReceiversSection';

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      defaultServerId: 1,
      devices: [],
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerRight: (
        <View>
          <BackupHeaderBtn navigation={navigation} />
        </View>
      ),
    };
  };

  componentDidMount() {
    this.getDevices();
  }

  async getDevices() {
    const devices = (await LocalDatabase.getListDevices()).map(device =>
      Device.getInstance(device),
    );
    this.setState({devices});
  }

  render() {
    const {defaultServerId, devices} = this.state;
    const {navigation} = this.props;
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={settingStyle.container}>
          <AccountSection navigation={navigation} devices={devices} />
          <NetworkSection
            navigation={navigation}
            defaultServerId={defaultServerId}
          />
          <PINSection navigation={navigation} />
          <SeparatorSection />
          <FrequentReceiverSection />
        </View>
        <TouchableOpacity
          onPress={async () => {
            if (__DEV__) {
              const passphrase = await getPassphrase();
              alert(JSON.stringify('passphrase =' + passphrase));
            }
          }}
        >
          <Text
            style={
              settingStyle.textVersion
            }
          >{`v${AppUpdater.appVersion}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

Setting.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Setting;
