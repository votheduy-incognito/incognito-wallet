import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Header from '@src/components/Header';
import { COLORS, FONT } from '@src/styles';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { TYPES, AddManuallyContext } from './AddManually.enhance';

const styled = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  text: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.colorGreyMedium,
  },
  boldText: {
    color: COLORS.black,
  },
  typeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  typesContainer: {
    marginTop: 42,
  },
});

const Modal = () => {
  const { handlePressChooseType, type, toggleChooseType } = React.useContext(
    AddManuallyContext,
  );
  const renderTypes = () =>
    Object.values(TYPES).map((TYPE) => {
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
              <FeatherIcons name="check" size={24} color={COLORS.black} />
            )}
          </TouchableOpacity>
        </View>
      );
    });
  return (
    <View style={styled.container}>
      <Header title="Select coin type" onGoBack={toggleChooseType} />
      <View style={styled.typesContainer}>{renderTypes()}</View>
    </View>
  );
};

Modal.propTypes = {};

export default compose(
  (Comp) => (props) => (
    <Comp {...{ props, containerStyled: { borderRadius: 8 } }} />
  ),
  withLayout_2,
)(Modal);
