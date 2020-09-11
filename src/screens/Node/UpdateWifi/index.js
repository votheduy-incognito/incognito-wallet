import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { PASS_HOSPOT } from 'react-native-dotenv';
import MainLayout from '@components/MainLayout';
import { InputExtension as Input } from '@components/core/TextInput';
import _ from 'lodash';
import NodeService from '@services/NodeService';
import { RoundCornerButton, Text } from '@components/core';
import theme from '@src/styles/theme';
import Util from '@src/utils/Util';
import { SuccessModal } from '@src/components';
import { MESSAGES } from '@src/constants';
import { checkPermission, ENUM_RESULT_PERMISSION, locationPermission } from '@utils/PermissionUtil';
import locationPermissionPng from '@assets/images/location.png';
import LinkingService from '@services/linking';
import WifiManager from 'react-native-wifi-reborn';
import axios from 'axios';
import APIService from '@services/api/miner/APIService';
import routeNames from '@routers/routeNames';
import KeepAwake from 'react-native-keep-awake';
import styles from './style';

const OUT_DATE_VERSIONS = ['1.0.0', '1.0.1', '1.0.2'];
const getWifiSSID = (empty = false) => {
  return Util.tryAtMost(async () => {
    let ssid;
    try {
      ssid = await WifiManager.getCurrentWifiSSID();
    } catch {
      ssid = '';
    }

    if (!empty && !ssid) {
      throw new Error('Can not get Wi-Fi SSID');
    }

    if (ssid.includes('unknown ssid')) {
      throw new Error('Can not get Wi-Fi SSID');
    }

    return ssid;
  }, 5, 2);
};

const NodeUpdateWifi = () => {
  const navigation = useNavigation();

  const device = useNavigationParam('device');
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [permission, setPermission] = useState(false);
  const [notSupported, setNotSupported] = useState('');

  const checkIfNodeSupportUpdateWifi = async () => {
    try {
      setLoading(true);
      if (device.IsSetupViaLan) {
        setNotSupported(MESSAGES.NODE_SETUP_LAN_NOT_SUPPORTED);
      } else if (device.IsOnline) {
        await checkVersion();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }

  };

  const checkVersion = async () => {
    try {
      setLoading(true);
      const version = await NodeService.checkVersion(device);

      if (OUT_DATE_VERSIONS.includes(version)) {
        setNotSupported(MESSAGES.NODE_OUT_OF_DATE);
      }

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWifi = async () => {
    try {
      const ssid = await getWifiSSID();
      setSSID(ssid);
    } catch {
      //
    }
  };

  useEffect(() => {
    checkIfNodeSupportUpdateWifi();
    getCurrentWifi();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const status = await checkPermission();
      switch (status) {
      case ENUM_RESULT_PERMISSION.DENIED.CODE:
      case ENUM_RESULT_PERMISSION.UNAVAILABLE.CODE:
      case ENUM_RESULT_PERMISSION.BLOCKED.CODE: {
        const granted = await locationPermission();
        if (granted) {
          return true;
        }
      }}
    } catch (e) {
      return false;
    }

    return true;
  };

  const updateWifi = async () => {
    try {
      setProcessing(true);
      setError('');
      KeepAwake.activate();

      if (device.IsOnline && device.Host) {
        await updateWifiViaFirebase();
      } else {
        await updateWifiViaHotspot();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      KeepAwake.deactivate();
      setProcessing(false);
    }
  };

  const updateWifiViaFirebase = async () => {
    await NodeService.updateWifi(device, ssid, password);
    await Util.delay(5);
    await checkCurrentWifi();
  };

  const connectToWifi = async (ssid, password) => {
    try {
      await new Promise((resolve, reject) => {
        let connectFunction = WifiManager.connectToProtectedSSID;
        let args = [ssid, password, false];
        if (Platform.OS === 'ios' && !password) {
          connectFunction = WifiManager.connectToSSID;
          args = [ssid];
        }

        connectFunction(...args).then(
          async () => {
            try {
              setCurrentStep('CONNECTED');
              await Util.tryAtMost(async () => {
                const currentSSID = await getWifiSSID(true);

                setCurrentStep(currentSSID);
                if (!currentSSID) {
                  throw new Error('Wifi name or password is incorrect');
                }
              }, 5, 3);
            } catch (e) {
              reject(e);
            }

            const currentSSID = await getWifiSSID();
            if (currentSSID === ssid) {
              resolve(true);
            } else  {
              reject(new Error('Connect to another Wi-Fi'));
            }
          },
          (error) => {
            console.debug('CONNECT ERROR', error);
            reject({});
          }
        );
      });
      return true;
    } catch (e) {
      throw new Error('Can not connect to ' + ssid);
    }
  };

  const checkCurrentWifi = async () => {
    setCurrentStep('CHECKING WIFI');

    const nodeWifi = await NodeService.getCurrentWifi(device);

    setCurrentStep('CURRENT WIFI: ' + nodeWifi);

    if (nodeWifi && nodeWifi === ssid) {
      setSuccess(true);
      return true;
    } else {
      throw new Error(MESSAGES.CAN_NOT_CHANGE_WIFI);
    }
  };

  const changeWifiWithAPI = (ip) => async () => {
    try {
      setCurrentStep('UPDATING WIFI');
      await Util.delay(2);
      await Util.excuteWithTimeout(axios.get(`http://${ip}:5000/change-wifi?qrcode=${device.QRCode}&ssid=${ssid}&password=${password}`), 10);
    } catch (e) {
      setCurrentStep(e.message);
    }
    await Util.delay(30);
    await checkCurrentWifi();
  };

  const updateWifiViaHotspot = async () => {
    const permission = await checkLocationPermission();

    if (!permission) {
      return setPermission(true);
    }

    const hotspotID = await Util.excuteWithTimeout(APIService.qrCodeGetWifi({ QRCode: device.QRCode }), 5);
    try {
      await connectToWifi(hotspotID, PASS_HOSPOT);
    } catch {
      //
    }

    setCurrentStep('CHANGING WIFI');
    await Util.tryAtMost(changeWifiWithAPI('10.42.0.1'), 5, 5);
  };

  const openLocation = () => {
    setPermission(false);
    if (Platform.OS === 'ios') {
      LinkingService.openSettings();
    } else {
      LinkingService.openLocation();
    }
  };

  const goBack = () => {
    navigation.navigate(routeNames.Node);
  };

  return (
    <MainLayout header="Change Wi-Fi" loading={loading}>
      { notSupported ?
        <Text style={theme.text.mediumTextMotto}>{notSupported}</Text> : (
          <>
            <Text style={theme.text.mediumTextMotto}>
              Please make sure your Node is online before changing networks.
            </Text>
            <Input
              underlineColorAndroid="transparent"
              containerStyle={styles.input}
              inputStyle={null}
              placeholder="Wi-Fi name"
              errorStyle={[null, {textAlign: 'left', marginLeft: 0}]}
              errorMessage={ssid !== null && _.isEmpty(ssid) ? 'Required' : ''}
              value={ssid}
              onChangeText={ssid => setSSID(ssid)}
            />
            <Input
              underlineColorAndroid="transparent"
              containerStyle={styles.input}
              autoCapitalize="none"
              inputContainerStyle={null}
              inputStyle={null}
              placeholder="Password"
              onChangeText={password => setPassword(password)}
              value={password}
            />
            {!!currentStep && global.isDebug() && <Text style={styles.error}>{error}</Text>}
            {!!error && <Text style={styles.error}>{error}</Text>}
            <RoundCornerButton
              disabled={!ssid}
              title="Update"
              style={[styles.button, theme.BUTTON.NODE_BUTTON]}
              isLoading={processing}
              onPress={updateWifi}
            />
            <SuccessModal
              title={MESSAGES.CHANGE_WIFI_SUCCESSFULLY_TITLE}
              extraInfo={MESSAGES.CHANGE_WIFI_SUCCESSFULLY_DESCRIPTION}
              visible={success}
              closeSuccessDialog={goBack}
            />
            <SuccessModal
              title="Help Node find you"
              extraInfo="Give the app permission to access your location"
              visible={permission}
              closeSuccessDialog={openLocation}
              buttonStyle={theme.BUTTON.NODE_BUTTON}
              icon={locationPermissionPng}
            />
          </>
        )
      }
    </MainLayout>
  );
};

export default NodeUpdateWifi;
