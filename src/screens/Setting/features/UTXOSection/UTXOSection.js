import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { SectionItem as Section } from '@screens/Setting/features/Section';

const UTXOSSection = () => {
  const navigation = useNavigation();
  const handleConsolidated = () => navigation.navigate(routeNames.Streamline);
  return (
    <Section
      data={{
        title: 'Consolidate',
        desc: 'Consolidate UTXOs for each keychain',
        handlePress: handleConsolidated,
      }}
    />
  );
};

export default React.memo(UTXOSSection);
