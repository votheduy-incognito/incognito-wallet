import React from 'react';
import {MineIcon} from '@src/components/Icons';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import Item from './SettingItem';
import Section from './Section';

const StakeSection = () => {
  const navigation = useNavigation();
  const itemsFactories = [
    {
      id: 0,
      title: 'Recover staking account',
      handlePress: () => navigation.navigate(routeNames.StakeRecoverAccount),
      icon: <MineIcon />,
    },
  ];
  return (
    <Section
      label="Staking Pool"
      customItems={itemsFactories.map((item, key, arr) => (
        <Item {...{...item, lastChild: arr.length - 1 === key}} key={key} />
      ))}
    />
  );
};

StakeSection.propTypes = {};

export default StakeSection;
