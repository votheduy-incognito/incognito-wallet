import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import ReceiverIcon from '@src/components/Icons/icon.receiver';
import {COLORS, FONT} from '@src/styles';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import {HEADER_TITLE_RECEIVERS} from '@src/redux/types/receivers';
import {CONSTANT_KEYS} from '@src/constants';
import Section from './Section';

const styled = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightGrey2,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.dark1,
    flex: 1,
    paddingLeft: 20,
  },
});

const Item = ({title, handlePress, disabled, lastChild}) => {
  return (
    <TouchableOpacity onPress={handlePress} disabled={disabled}>
      <View
        style={[
          styled.item,
          disabled && {opacity: 0.5},
          lastChild && {borderBottomWidth: 0},
        ]}
      >
        <ReceiverIcon />
        <Text style={styled.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

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
    },
    {
      title: HEADER_TITLE_RECEIVERS.WITHDRAW,
      handlePress: () =>
        handleNavigateFrequentReceivers({
          keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK,
          headerTitle: HEADER_TITLE_RECEIVERS.ADDRESS_BOOK,
        }),
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
