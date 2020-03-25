import StepIndicator from '@components/StepIndicator';
import BaseScreen from '@screens/BaseScreen';
import {TouchableOpacity, View} from '@src/components/core';
import {getAccountByName} from '@src/redux/selectors/account';
import routeNames from '@src/router/routeNames';
import React from 'react';
import {connect} from 'react-redux';
import FirstScreen from '@screens/GetStartedAddNode/components/FirstScreen';
import { locationPermission } from '@src/utils/PermissionUtil';
import TurnOffCellular from '@screens/GetStartedAddNode/components/TurnOffCellular';
import {COLORS} from '@src/styles';
import {Icon} from 'react-native-elements';
import ScanQRCode from './components/ScanQRCode';
import SetupWifi from './components/SetupWifi';
import {DialogNotify} from './components/BackUpAccountDialog';
import styles from './styles';

export const TAG = 'GetStartedAddNode';

const TEST_DATA = {
  step: 2,
  qrCode: '0205-284853',
  account: {'name':'0205-284853','AccountName':'0205-284853','PaymentAddress':'12S24P6ReX425TqJDoj2U74F9y9seYSPKbK9mNrQrrHZbXubT13iz2wC7dBefaGnfNft62x9Gm8VDRkMn9f71Zg6ryu43aUrPkmKU5T','ReadonlyKey':'13hdeYULQK8R6BVmqsuPJo3B5hC4rZRuRoWy2MWzwoQoWuqzghTRS6YNqysDG9r7GNje8PoFxKTWQedh3S7Vk9BqTFZ1RD49tN9gLYf','PrivateKey':'112t8rndgm2LWVVkhYPakXGNGyaAb78rjtUxPqScudXegEr3UNJVxWnm42QY1eoKNLeBQGD92PLkSKzdNY234tTjua2ymP6MHemShLP5Qwiz','PublicKey':'b4ac7d62696a6a2f58465697f8e098f64cd090d96fe19c3d9ebfedbdf1ac7dad','PublicKeyCheckEncode':'12Na52Ze5U6UzumVtFs5NK5dSLcXbm82n6wdRQzxYewkKMe8DYm','PublicKeyBytes':'180,172,125,98,105,106,106,47,88,70,86,151,248,224,152,246,76,208,144,217,111,225,156,61,158,191,237,189,241,172,125,173','ValidatorKey':'123LVpXiFGQXg6txnt8BCD5yP8erSxDu6J8fkYWT67Z5GYjyPMo'},
  hotspotSSID: 'TheMiner-284853',
};

class GetStartedAddNode extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      qrCode: null,
      account: null,
      step: 0,
      hotspotSSID: '',
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate(routeNames.NodeHelp)}
          style={styles.headerRight}
        >
          <Icon name="help-outline" color={COLORS.white} />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    locationPermission();
  }

  handleFinish = () => {
    this.setState({ success: false }, () => {
      this.goToScreen(routeNames.Node, {setupNode: true});
    });
  };

  handleSetupComplete = () => {
    this.setState({ success: true });
  };

  nextScreen = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  scanQrCodeComplete = ({ qrCode, account, hotspotSSID }) => {
    if (account && account?.ValidatorKey && account?.PaymentAddress) {
      this.setState({qrCode, account, hotspotSSID}, this.nextScreen);
    }
  };

  renderStep() {
    const { step, qrCode, hotspotSSID, account } = this.state;

    if (step === 0) {
      return (
        <FirstScreen
          onNext={this.nextScreen}
          goToScreen={this.goToScreen}
        />
      );
    }

    if (step === 1) {
      return (
        <ScanQRCode onNext={this.scanQrCodeComplete} />
      );
    }

    if (step === 2) {
      return (
        <TurnOffCellular onNext={this.nextScreen} />
      );
    }

    if (step === 3) {
      return (
        <SetupWifi
          onNext={this.handleSetupComplete}
          qrCode={qrCode}
          account={account}
          hotspotSSID={hotspotSSID}
        />
      );
    }
  }

  render() {
    const {success, step} = this.state;
    return (
      <View style={styles.container}>
        <DialogNotify visible={success} onClose={this.handleFinish} />
        <StepIndicator stepCount={4} currentPage={step} />
        {this.renderStep()}
      </View>
    );
  }

}

GetStartedAddNode.propTypes = {};

GetStartedAddNode.defaultProps = {};
const mapStateToProps = state => ({
  getAccountByName: getAccountByName(state),
});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GetStartedAddNode);
