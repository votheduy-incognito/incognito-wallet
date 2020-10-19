import BaseScreen from '@screens/BaseScreen';
import { View, ScrollView } from '@src/components/core';
import { getAccountByName } from '@src/redux/selectors/account';
import routeNames from '@src/router/routeNames';
import React from 'react';
import { connect } from 'react-redux';
import FirstScreen from '@screens/GetStartedAddNode/components/FirstScreen';
import { locationPermission, checkPermission, ENUM_RESULT_PERMISSION } from '@src/utils/PermissionUtil';
import TurnOffCellular from '@screens/GetStartedAddNode/components/TurnOffCellular';
import WifiManager from 'react-native-wifi-reborn';
import { checkBandWidth } from '@src/utils/connection';
import RNSettings from 'react-native-settings';
import NetInfo from '@react-native-community/netinfo';
import { Linking, Platform } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import locationPermissionPng from '@src/assets/images/location.png';
import LogManager from '@src/services/LogManager';
import LocalDatabase from '@src/utils/LocalDatabase';
import NodeService from '@src/services/NodeService';
import Header from '@src/components/Header';
import NavigationService from '@src/services/NavigationService';
import { BtnQuestionDefault } from '@src/components/Button';
import { withLayout_2 } from '@components/Layout';
import { SuccessModal } from '@src/components';
import theme from '@src/styles/theme';
import { BackUpAccountModal } from '@screens/Node/BackuUpAccountModal';
import ScanQRCode from './components/ScanQRCode';
import styles from './styles';
import ConnectionCheck from './components/ConnectionCheck';
import WifiSetup from './components/SetupWifi';

export const TAG = 'GetStartedAddNode';


const CONNECTION_STATUS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

const MINIMUM_BANDWIDTH = 0.3;
var oldVerifyProductCode = '';
class GetStartedAddNode extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      qrCode: null,
      account: null,
      step: 0,
      hotspotSSID: '',
      success: false,
      statusConnection: CONNECTION_STATUS.LOW,
      bandWidth: {},
      errPermission: '',
      isErrPermission: false,
      showBandWidthModal: false,
      showModalMissingSetup: false,
    };
  }

  componentDidMount = async () => {
    this.checkPermissionForSteps();
    this.checkBandwidthNetwork();
    if (Platform.OS === 'android') {
      let isEnabledLocation = await this.checkLocationService();
      if (!isEnabledLocation) {
        this.warningLocationService();
      }
    }
  };

  checkLocationService = async () => {
    let res = await RNSettings.getSetting(RNSettings.LOCATION_SETTING);
    return res === RNSettings.ENABLED;
  };

  openLocationService = async () => {
    await RNSettings.openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS);
  };

  checkBandwidthNetwork = async () => {
    await this.getNetworkBandwidth();
  };

  warningLocationService = () => {
    this.setState({ isErrPermission: true });
  };

  checkPermissionForSteps = async () => {
    let isGranted = false;
    await checkPermission()
      .then(status => {
        switch (status) {
        case ENUM_RESULT_PERMISSION.GRANTED.CODE: {
          this.setState({ errPermission: '', isErrPermission: false });
          isGranted = true;
        }
          break;
        case ENUM_RESULT_PERMISSION.DENIED.CODE: {
          locationPermission()
            .then(val => {
              if (!val) {
                isGranted = false;
                this.setState({ errPermission: ENUM_RESULT_PERMISSION.UNAVAILABLE.MESSAGE, isErrPermission: true });
              } else {
                isGranted = true;
              }
            })
            .catch(() => {
              isGranted = false;
              this.setState({ errPermission: ENUM_RESULT_PERMISSION.UNAVAILABLE.MESSAGE, isErrPermission: true });
            });
        }
          break;
        case ENUM_RESULT_PERMISSION.UNAVAILABLE.CODE:
        case ENUM_RESULT_PERMISSION.BLOCKED.CODE: {
          this.setState({ errPermission: ENUM_RESULT_PERMISSION.UNAVAILABLE.MESSAGE, isErrPermission: true });
          isGranted = false;
        }
          break;
        default: {
          isGranted = false;
        }
          break;
        }
      })
      .catch(() => {
        isGranted = false;
      })
      .finally(() => {
        return isGranted;
      });
    return isGranted;
  };

  componentWillUnmount() {
    this.focusedListener && this.focusedListener?.remove();
  }

  checkBandwidthValid = (speed) => {
    if (!speed || Number.isNaN(speed)) {
      this.setState({ showBandWidthModal: false });
    } else {
      this.setState({ showBandWidthModal: speed <= MINIMUM_BANDWIDTH });
    }
  };

  getNetworkBandwidth = async () => {
    await checkBandWidth()
      .then(data => {
        console.log('Check bandwidth ' + LogManager.parseJsonObjectToJsonString(data));
        this.setState({ bandWidth: data }, () => {
          this.checkBandwidthValid(data?.speed || 0);
        });
      })
      .catch(() => {
        this.setState({ bandWidth: {}, showBandWidthModal: true });
      });

    // If wanna cancel, do this.
    // await cancelCheckBandWidth();
  };

  handleFinish = () => {
    this.setState({ success: false }, () => {
      this.goToScreen(routeNames.Node, {
        refresh: new Date().getTime()
      });
    });
  };

  handleSetupComplete = () => {
    this.setState({ success: true });
  };

  nextScreen = async () => {
    const { bandWidth } = this.state;
    let isLocationGranted = Platform.OS === 'android' ? await this.checkLocationService() : await this.checkPermissionForSteps();
    if (isLocationGranted) {
      if (Platform.OS === 'ios') {
        if (Number(bandWidth?.speed || 0) > MINIMUM_BANDWIDTH) {
          const { step } = this.state;
          this.setState({ step: step + 1 });
        } else {
          this.setState({ showBandWidthModal: true });
        }
      } else {
        let recheck = await this.checkPermissionForSteps();
        if (recheck) {
          if (Number(bandWidth?.speed || 0) > MINIMUM_BANDWIDTH) {
            const { step } = this.state;
            this.setState({ step: step + 1 });
          } else {
            this.setState({ showBandWidthModal: true });
          }
        } else {
          this.warningLocationService();
        }
      }
    } else {
      this.warningLocationService();
    }
  };

  scanQrCodeComplete = async ({ qrCode, account, hotspotSSID }) => {
    if (this.state.step === 1) { //QRCode
      let verifyProductCode = await LocalDatabase.getVerifyCode();
      if (verifyProductCode && verifyProductCode !== '') {
        let result = await NodeService.verifyProductCode(verifyProductCode);
        if (result && result?.verify_code === verifyProductCode) {
          oldVerifyProductCode = verifyProductCode;
          this.setState({showModalMissingSetup: true});
        } else {
          if (account && account?.ValidatorKey && account?.PaymentAddress) {
            this.setState({ qrCode, account, hotspotSSID }, this.nextScreen);
          }
        }
      } else {
        // Force eventhough the same
        LocalDatabase.saveVerifyCode('');
        if (account && account?.ValidatorKey && account?.PaymentAddress) {
          this.setState({ qrCode, account, hotspotSSID }, this.nextScreen);
        }
      }
    } else {
      if (account && account?.ValidatorKey && account?.PaymentAddress) {
        this.setState({ qrCode, account, hotspotSSID }, this.nextScreen);
      }
    }
  };
  // Get current wifi
  getCurrentWifi = async () => {
    try {
      const ssid = await WifiManager.getCurrentWifiSSID();

      console.debug('SSID', ssid);

      this.setState({ ssid });
      return ssid;
    } catch (error) {
      this.setState({ ssid: '' });
      return '';
    }
  };

  setStep = async (step) => {
    // Check internet connectable
    let isConnected = await (await NetInfo.fetch()).isConnected;
    let connectable = await (await NetInfo.fetch()).isInternetReachable;
    // And wifi name is the same with hotspot
    let wifiName = await this.getCurrentWifi();

    this.setState({ step: step });
    if (!isConnected || !connectable || !wifiName || wifiName.includes('Node') || wifiName === '') {
      this.setState({ showBandWidthModal: true });
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
        <ConnectionCheck onNext={this.nextScreen} />
      );
    }

    return (
      <WifiSetup
        onNext={this.handleSetupComplete}
        setStep={this.setStep}
        qrCode={qrCode}
        account={account}
        hotspotSSID={hotspotSSID}
      />
    );
  }

  openSettingApp = () => {
    let messageErr = 'Can\'t handle settings url, please go to Setting manually';
    try {
      Linking.openSettings();
    } catch (err) {
      alert(messageErr);
    }
  };

  render() {
    const { success, isErrPermission, showBandWidthModal } = this.state;
    return (
      <View style={styles.container}>
        <Header
          rightHeader={<BtnQuestionDefault onPress={()=>NavigationService.navigate(routeNames.NodeHelp)} />}
          title=""
          style={styles.header}
        />
        <BackUpAccountModal onClose={this.handleFinish} visible={success} />
        <ScrollView contentContainerStyle={styles.contentWrapper} paddingBottom>
          {this.renderStep()}
        </ScrollView>
        <SuccessModal
          title="Help Node find you"
          extraInfo="Please give the app permission to access your location."
          visible={isErrPermission}
          closeSuccessDialog={() => {
            this.setState({ errPermission: '', isErrPermission: false });
            if (Platform.OS === 'ios') {
              this.openSettingApp();
            } else {
              this.openLocationService();
            }
          }}
          buttonStyle={theme.BUTTON.NODE_BUTTON}
          icon={locationPermissionPng}
        />
        <SuccessModal
          title="Unable to connect"
          extraInfo="Please ensure you are connected to Wi-Fi and try again."
          visible={showBandWidthModal}
          closeSuccessDialog={() => {
            this.setState({ showBandWidthModal: false });
            this.openSettingApp();
          }}
          buttonStyle={theme.BUTTON.NODE_BUTTON}
        />
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
)(
  withLayout_2(
    withNavigationFocus(
      GetStartedAddNode
    )
  )
);
