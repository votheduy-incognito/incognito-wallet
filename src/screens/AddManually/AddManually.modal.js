import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Header from '@src/components/Header';
import { COLORS, FONT } from '@src/styles';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { Divider } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import { TYPES, AddManuallyContext } from './AddManually.enhance';

const styled = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  text: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
  },
  boldText: {
    color: COLORS.black,
  },
  typeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
});

const Modal = () => {
  const { handlePressChooseType, type, toggleChooseType } = React.useContext(
    AddManuallyContext,
  );
  const renderTypes = () =>
    Object.values(TYPES).map((TYPE, index, allType) => {
      const selected = type === TYPE.value;
      return (
        <View key={TYPE.value}>
          <TouchableOpacity
            key={TYPE.value}
            onPress={() => handlePressChooseType(TYPE.value)}
            style={styled.typeItem}
          >
            <Text style={[styled.text, selected && styled.boldText]}>
              {TYPE.label}
            </Text>
            {selected && (
              <FeatherIcons name="check" size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>
          {index < allType.length - 1 && <Divider color={COLORS.lightGrey6} />}
        </View>
      );
    });
  return (
    <View style={styled.container}>
      <Header title="Select a coin" onGoBack={toggleChooseType} />
      {renderTypes()}
    </View>
  );
};

Modal.propTypes = {};

export default withLayout_2(Modal);
