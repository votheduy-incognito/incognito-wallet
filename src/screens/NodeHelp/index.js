import React from 'react';
import { Text, View } from '@src/components/core';
import MainLayout from '@components/MainLayout/index';
import styles from './style';

const troubleshootCases = [
  {
    id: 1,
    title: 'Case 1 - Unable connect to Node-xxx:',
    description: 'If the corresponding network Node-xxxx does not appear in your list of networks on your first attempt, unplug the device and plug it in again. You may need to do this a few times.',
  },
  {
    id: 2,
    title: 'Case 2 - Network error:',
    description: 'Make sure your Wi-Fi is working, and that your connection is stable. Then try again. In case your wifi network is unstable, find a more stable one, and choose to forget pasword of the current wifi in order to prevent networks switching back & forth which will lead to setup failure.',
  },
  {
    id: 3,
    title: 'Case 3 - Send validator key failed:',
    description: 'Please make sure your Mobile data is off, and your phone is less than 1 meter away from the node.',
  },
  {
    id: 4,
    title: 'Case 4 - Verify code error:',
    description: 'Make sure your Wi-Fi is working. If it is, then please make sure the password was entered correctly.',
  },
  {
    id: 5,
    title: 'Case 5 - Setup failed',
    description: 'If setup failed, but you saw \'Verify code success\' & \'Authenticate firebase success\' messages at step 4, then go back to the first step, scan the QR code again, and proceed as instructed. If you see \'You\'ve already set up this node\', try adding the QR code manually.',
  }
];

const NodeHelp = () => (
  <MainLayout header="Need help" scrollable>
    <Text style={[styles.header, {marginTop: 0}]}>
      Important notes
    </Text>
    <View>
      <Text style={styles.title}>
        Wi-Fi only
      </Text>
      <Text style={styles.text}>
        During set up, mobile data for Android (or cellular, for iOS) should be switched off. You can do this from your
        device settings. You should remain connected to Wi-Fi. This is to prevent switching between networks, which may
        cause setup to fail. After setup, feel free to turn mobile data back on.
      </Text>
      <Text style={[styles.marginTop, styles.text]}>
        Of course, please make sure your home Wi-Fi details are correct. If your home Wi-Fi doesn’t show up in the list
        of networks, please restart your phone and try again.
      </Text>
    </View>
    <View>
      <Text style={styles.title}>
        Enable location access
      </Text>
      <Text style={styles.text}>
        This step is needed to help Node find your home Wi-Fi.
      </Text>
    </View>
    <View style={{paddingBottom: 0, marginTop: 25}}>
      <Text style={styles.header}>
        Troubleshoot
      </Text>
      <Text style={[styles.title, styles.text, styles.noMarginTop]}>
        What to do if you encounter one of the following error messages:
      </Text>
      {troubleshootCases.map(item => (
        <View key={item.id}>
          <Text style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.text}>
            {item.description}
          </Text>
        </View>
      ))}
      <Text style={[styles.marginTop, styles.text]}>
        Still stuck? We’re here to help. Contact us at go@incognito.org
      </Text>
    </View>
  </MainLayout>
);

export default React.memo(NodeHelp);
