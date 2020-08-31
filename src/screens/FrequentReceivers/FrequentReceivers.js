import React from 'react';
import { View } from 'react-native';
import Header from '@src/components/Header';
import { useNavigationParam } from 'react-navigation-hooks';
import { DropdownMenu, ScrollView } from '@src/components/core';
import PropTypes from 'prop-types';
import withListAllReceivers from './FrequentReceivers.enhance';
import Item from './FrequentReceivers.item';
import EmptyList from './FrequentReceivers.empty';
import { styledModal as styled } from './FrequentReceivers.styled';

const ListReceivers = (props) => {
  const { receivers, isEmpty } = props;
  const onSelectedItem = useNavigationParam('onSelectedItem');
  const disabledSwipe = useNavigationParam('disabledSwipe');
  const onSelectedAddress = async (receiver = { name: '', address: '' }) => {
    if (typeof onSelectedItem === 'function') {
      return onSelectedItem(receiver);
    }
  };
  if (isEmpty) {
    return <EmptyList />;
  }
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
          style={{ marginBottom: 30 }}
        />
      ))}
    </>
  );
};

const ListAllReceivers = (props) => {
  const { Wrapper, receivers, isEmpty } = props;
  return (
    <View style={styled.container}>
      <Header
        title="Search by name or address"
        style={styled.header}
        canSearch
      />
      <Wrapper
        behavior="padding"
        keyboardVerticalOffset={25}
        style={{
          flex: 1,
          marginHorizontal: 25,
          marginTop: 42,
        }}
      >
        <ScrollView>
          <ListReceivers {...{ receivers, isEmpty }} />
        </ScrollView>
      </Wrapper>
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
