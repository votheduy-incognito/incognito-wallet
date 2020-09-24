import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { PASS_HOSPOT } from 'react-native-dotenv';
import MainLayout from '@components/MainLayout';
import { InputExtension as Input } from '@components/core/TextInput';
import _ from 'lodash';
import NodeService from '@services/NodeService';
import { RoundCornerButton, Text, View } from '@components/core';
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

const OUT_DATE_VERSIONS = ['1.0.0', '1.0.1', '1.0.2', '1.0.3'];

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

const NotSupport = () => (
  <View>
    <Text style={[theme.text.mediumTextStyle, { marginBottom: 20, lineHeight: 30 }]}>
      {MESSAGES.NODE_NOT_SUPPORTED_UPDATE_WIFI_TITLE}
    </Text>
    <Text style={[theme.text.mediumTextMotto, { lineHeight: 30 }]}>
      {MESSAGES.NODE_NOT_SUPPORTED_UPDATE_WIFI_DESCRIPTION}
    </Text>
  </View>
);

const OutOfDate = () => (
  <View>
    <Text style={[theme.text.mediumTextStyle, { marginBottom: 20, lineHeight: 30 }]}>
      {MESSAGES.NODE_OUT_OF_DATE}
    </Text>
  </View>
);

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
  const [notSupported, setNotSupported] = useState(false);
  const [outOfDate, setOutOfDate] = useState(false);

  const checkIfNodeSupportUpdateWifi = async () => {
    try {
      setLoading(true);
      if (device.IsSetupViaLan) {
        setNotSupported(true);
      } else if (device.Host) {
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
      const version = device.Firmware;
      if (OUT_DATE_VERSIONS.includes(version)) {
        setOutOfDate(true);
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
      setCurrentStep(e.message || e);
      setError(MESSAGES.CAN_NOT_CHANGE_WIFI);
    } finally {
      KeepAwake.deactivate();
      setProcessing(false);
    }
  };

  const updateWifiViaFirebase = async () => {
    await NodeService.updateWifi(device, `'${ssid}'`, `'${password}'`);
    await Util.delay(10);
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

                console.debug('SSID', currentSSID);

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
      setError(MESSAGES.CAN_NOT_CHANGE_WIFI);
    }
  };

  const changeWifiWithAPI = async (ip, hotspotID) => {
    try {
      try {
        setCurrentStep('CONNECTING TO HOTSPOT ' + hotspotID);
        await connectToWifi(hotspotID, PASS_HOSPOT);
        await Util.delay(5);
      } catch {
        //
      }

      const currentSSID = await getWifiSSID(false);

      if (currentSSID !== hotspotID) {
        return setError(MESSAGES.CAN_NOT_CONNECT_HOTSPOT);
      }

      setCurrentStep('UPDATING WIFI');
      await Util.delay(2);
      const qrCodeURI = encodeURIComponent(device.QRCode);
      const ssidURI = encodeURIComponent(`'${ssid}'`);
      const passwordURI = encodeURIComponent(`'${password}'`);
      axios.get(`http://${ip}:5000/change-wifi?qrcode=${qrCodeURI}&ssid=${ssidURI}&password=${passwordURI}`);
      axios.get(`http://${ip}:5000/update-wifi?qrcode=${qrCodeURI}&ssid=${ssidURI}&password=${passwordURI}`);
      await Util.delay(10);
    } catch (e) {
      return setError(MESSAGES.CAN_NOT_CONNECT_HOTSPOT);
    }

    try {
      setCurrentStep('WAIT FOR NODE ONLINE');
      // Call this action to clear firebase database
      await NodeService.pingGetIP(device, 30);
    } catch {
      //
    }

    const newIp = await NodeService.pingGetIP(device, 10);
    setCurrentStep(`NEW IP ${newIp}`);

    const version = await NodeService.checkVersion(device);
    setCurrentStep(`VERSION ${version}`);

    if (OUT_DATE_VERSIONS.includes(version)) {
      setSuccess(true);
      NodeService.updateFirware(device)
        .catch(e => console.debug('UPDATE FIRMWARE FAILED', e));
    } else {
      await checkCurrentWifi();
    }
  };

  const updateWifiViaHotspot = async () => {
    const permission = await checkLocationPermission();

    if (!permission) {
      return setPermission(true);
    }

    const hotspotID = await APIService.qrCodeGetWifi({ QRCode: device.QRCode });

    console.debug('HOTSPOT ID', hotspotID);

    if (!hotspotID) {
      setError(MESSAGES.CAN_NOT_GET_HOTSPOT_ID + ' ' + hotspotID);
    }

    await changeWifiWithAPI('10.42.0.1', hotspotID);
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

  const renderContent = () => {
    if (notSupported) {
      return <NotSupport />;
    }

    if (outOfDate) {
      return <OutOfDate />;
    }

    return (
      <View>
        <Text style={[theme.text.mediumTextMotto, { lineHeight: 30, marginBottom: 20 }]}>
          {MESSAGES.UPDATE_WIFI_INSTRUCTION}
        </Text>
        <Input
          underlineColorAndroid="transparent"
          containerStyle={styles.input}
          inputStyle={styles.inputStyle}
          placeholder="Wi-Fi name"
          errorStyle={[null, {textAlign: 'left', marginLeft: 0}]}
          errorMessage={ssid !== null && _.isEmpty(ssid) ? 'Required' : ''}
          value={ssid}
          onChangeText={ssid => setSSID(ssid)}
          disabled={processing}
        />
        <Input
          underlineColorAndroid="transparent"
          containerStyle={styles.input}
          autoCapitalize="none"
          inputContainerStyle={null}
          inputStyle={styles.inputStyle}
          placeholder="Password"
          onChangeText={password => setPassword(password)}
          value={password}
          disabled={processing}
        />
        {!!currentStep && <Text style={styles.error}>{currentStep}</Text>}
        {!!error && <Text style={styles.error}>{error}</Text>}
        <RoundCornerButton
          disabled={!ssid}
          title="Update"
          style={[styles.button, theme.BUTTON.NODE_BUTTON]}
          isLoading={processing}
          onPress={updateWifi}
        />
      </View>
    );
  };

  return (
    <MainLayout header="Change Wi-Fi" loading={loading}>
      {renderContent()}
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
    </MainLayout>
  );
};

export default NodeUpdateWifi;
