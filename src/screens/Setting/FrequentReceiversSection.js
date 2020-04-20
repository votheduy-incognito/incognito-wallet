import React from 'react';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import {HEADER_TITLE_RECEIVERS} from '@src/redux/types/receivers';
import {CONSTANT_KEYS} from '@src/constants';
import ReceiverIcon from '@src/components/Icons/icon.receiver';
import Section from './Section';
import Item from './SettingItem';

const FrequentReceiverSection = props => {
  const navigation = useNavigation();
  const onSelectedItem = ({info, keySave}) => {
    navigation.navigate(routeNames.FrequentReceiversForm, {
      info: {
        ...info,
        toAddress: info?.address,
      },
      keySave,
      action: 'update',
      headerTitle: 'Edit',
    });
  };
  const handleNavigateFrequentReceivers = ({keySave, headerTitle, keySync}) =>
    navigation.navigate(routeNames.FrequentReceivers, {
      keySave,
      keySync,
      disabledSwipe: false,
      disabledSelectedAddr: true,
      headerTitle,
      onSelectedItem: info => onSelectedItem({keySave, info}),
    });
  const itemsFactories = [
    {
      title: HEADER_TITLE_RECEIVERS.SENDIN,
      handlePress: () =>
        handleNavigateFrequentReceivers({
          keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK,
          headerTitle: HEADER_TITLE_RECEIVERS.ADDRESS_BOOK,
        }),
      icon: <ReceiverIcon />,
    },
    {
      title: HEADER_TITLE_RECEIVERS.WITHDRAW,
      handlePress: () =>
        handleNavigateFrequentReceivers({
          keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK,
          headerTitle: HEADER_TITLE_RECEIVERS.ADDRESS_BOOK,
        }),
      icon: <ReceiverIcon />,
    },
  ];
  return (
    <Section
      label="Address Book"
      customItems={itemsFactories.map((item, key, arr) => (
        <Item {...{...item, lastChild: arr.length - 1 === key}} key={key} />
      ))}
    />
  );
};

FrequentReceiverSection.propTypes = {};

export default FrequentReceiverSection;
