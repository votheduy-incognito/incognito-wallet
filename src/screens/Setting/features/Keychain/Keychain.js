import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import { settingSelector } from '@screens/Setting/Setting.selector';
import AccountSection from '@screens/Setting/features/AccountSection';
import routeNames from '@src/router/routeNames';
import { Text } from '@src/components/core';
import { SectionItem } from '@screens/Setting/features/Section';
import {
  currentMasterKeySelector,
  masterlessKeyChainSelector,
} from '@src/redux/selectors/masterKey';
import MainLayout from '@components/MainLayout';
import { THEME } from '@src/styles';
import withKeychain from './Keychain.enhance';
import RightBtn from './RightBtn';
import BtnInfo from './BtnInfo';

const styled = StyleSheet.create({
  extra: {
    paddingHorizontal: 25,
  },
  warning: {
    lineHeight: 24,
    ...THEME.text.mediumText,
    marginBottom: 30,
  },
});

const Keychain = () => {
  const navigation = useNavigation();
  const { devices } = useSelector(settingSelector);
  const masterKey = useSelector(currentMasterKeySelector);
  const masterlessKey = useSelector(masterlessKeyChainSelector);

  const isMasterless = masterKey === masterlessKey;

  const sectionItemFactories = [];

  if (!isMasterless) {
    sectionItemFactories.push({
      title: 'Create',
      desc: `Create a new keychain in ${masterKey?.name}`,
      handlePress: () => navigation.navigate(routeNames.CreateAccount),
    });
  }

  if (isMasterless) {
    sectionItemFactories.push({
      title: 'Import a keychain',
      desc: 'Using a private key',
      handlePress: () => navigation.navigate(routeNames.ImportAccount),
    });

    sectionItemFactories.push({
      title: 'Back up',
      desc: 'Back up all masterless private keys',
      handlePress: () => navigation.navigate(routeNames.BackupKeys),
    });
  } else {
    sectionItemFactories.push({
      title: `Reveal ${masterKey.name} recovery phrase`,
      desc: 'Back up this phrase so that even if you lose your device, you will always have access to your funds',
      handlePress: () => navigation.navigate(routeNames.MasterKeyPhrase, { data: { ...masterKey, isBackUp: true } }),
    });

    sectionItemFactories.push({
      title: 'Import a keychain',
      desc: 'Using a private key',
      handlePress: () => navigation.navigate(routeNames.ImportAccount),
    });
  }

  return (
    <MainLayout
      header="Keychain"
      scrollable
      rightHeader={<RightBtn title={masterKey.name} />}
      customHeaderTitle={<BtnInfo />}
      noPadding
    >
      <AccountSection
        devices={devices}
        label={isMasterless ? 'Masterless keychains' : 'Your keychains'}
      />
      <View style={styled.extra}>
        {sectionItemFactories.map((item) => (
          <SectionItem
            data={item}
            key={item.title}
          />
        ))}
      </View>
      {isMasterless && (
        <Text style={[styled.extra, styled.warning]}>
         􀇿 You will not be able to back up these keychains with a master key phrase. Each keychain is only recoverable using its unique private key, so please keep them all safe.
          {('\n\n')}
         Alternatively, you may wish to transfer funds to keychains that are linked to a master key.
        </Text>
      )}
    </MainLayout>
  );
};

Keychain.propTypes = {};

export default withKeychain(Keychain);
