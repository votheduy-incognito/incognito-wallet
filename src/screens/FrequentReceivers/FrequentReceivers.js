import React from 'react';
import { View } from 'react-native';
import Header from '@src/components/Header';
import { useNavigationParam } from 'react-navigation-hooks';
import { DropdownMenu, KeyboardAwareScrollView } from '@src/components/core';
import PropTypes from 'prop-types';
import withListAllReceivers from './FrequentReceivers.enhance';
import Item from './FrequentReceivers.item';
import { styledModal as styled } from './FrequentReceivers.styled';

const ListReceivers = (props) => {
  const { receivers } = props;
  const onSelectedItem = useNavigationParam('onSelectedItem');
  const disabledSwipe = useNavigationParam('disabledSwipe');
  const onSelectedAddress = async (receiver = { name: '', address: '' }) => {
    if (typeof onSelectedItem === 'function') {
      return onSelectedItem(receiver);
    }
  };
  return (
    <>
      {receivers?.map((receiver, index) => (
        <DropdownMenu
          sections={[receiver]}
          renderItem={({ item }) => {
            return (
              <Item
                {...{
                  ...item,
                  disabledSwipe,
                  keySave: receiver?.keySave,
                  onPress: () =>
                    onSelectedAddress({ ...item, keySave: receiver?.keySave }),
                }}
              />
            );
          }}
          key={index}
          customStyle={[
            { marginBottom: 30 },
            index === 0 ? { paddingTop: 40 } : null,
          ]}
        />
      ))}
    </>
  );
};

const ListAllReceivers = (props) => {
  const { receivers, isEmpty } = props;
  return (
    <View style={styled.container}>
      <Header
        title="Search by name or address"
        style={styled.header}
        canSearch
      />
      <KeyboardAwareScrollView
        style={{
          marginHorizontal: 25,
        }}
      >
        <ListReceivers {...{ receivers, isEmpty }} />
      </KeyboardAwareScrollView>
    </View>
  );
};

ListReceivers.propTypes = {
  receivers: PropTypes.array.isRequired,
  isEmpty: PropTypes.bool.isRequired,
};

ListAllReceivers.propTypes = {
  receivers: PropTypes.array.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  Wrapper: PropTypes.any.isRequired,
};

export default withListAllReceivers(ListAllReceivers);
