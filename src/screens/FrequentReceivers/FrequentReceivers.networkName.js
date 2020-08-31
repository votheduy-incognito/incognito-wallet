import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@src/components/Header';
import { useNavigation } from 'react-navigation-hooks';
import { ScrollView, TouchableOpacity, Toast } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import { FONT, COLORS } from '@src/styles';
import { toUpper } from 'lodash';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionUpdate,
  actionSelectedReceiver,
} from '@src/redux/actions/receivers';
import { selectedReceiverSelector } from '@src/redux/selectors/receivers';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    marginTop: 42,
  },
  networkName: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.colorGreyBold,
  },
  networkNameContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const SelectNetworkName = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { rootNetworkName, address, keySave } = useSelector(
    selectedReceiverSelector,
  );
  const factoriesETHNetwork = [
    CONSTANT_COMMONS.NETWORK_NAME.ETHEREUM,
    CONSTANT_COMMONS.NETWORK_NAME.TOMO,
  ];
  const handleChooseNetworkName = async (networkName) => {
    await dispatch(
      actionUpdate({
        keySave,
        receiver: {
          address,
          rootNetworkName: networkName,
        },
      }),
    );
    await dispatch(actionSelectedReceiver({ keySave, address }));
    Toast.showSuccess('Updated');
    navigation.goBack();
  };

  return (
    <View style={styled.container}>
      <Header title="Select network name" />
      <ScrollView>
        <View style={styled.wrapper}>
          {factoriesETHNetwork.map((networkName) => {
            const selected = networkName === rootNetworkName;
            return (
              <TouchableOpacity
                key={networkName}
                style={styled.networkNameContainer}
                onPress={() => handleChooseNetworkName(networkName)}
              >
                <Text
                  style={[
                    styled.networkName,
                    selected ? { color: COLORS.black } : null,
                  ]}
                >
                  {toUpper(networkName)}
                </Text>
                {selected && (
                  <FeatherIcons name="check" size={24} color={COLORS.black} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

SelectNetworkName.propTypes = {};

export default withLayout_2(React.memo(SelectNetworkName));
