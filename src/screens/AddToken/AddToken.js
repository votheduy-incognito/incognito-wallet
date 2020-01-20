import React, { Component } from 'react';
import { View, Divider, Container, Text, ScrollView, Modal, TouchableOpacity } from '@src/components/core';
import AddERC20Token from '@src/components/AddERC20Token';
import AddBep2Token from '@src/components/AddBep2Token';
import AddInternalToken from '@src/components/AddInternalToken';
import { COLORS } from '@src/styles';
import Icons from 'react-native-vector-icons/Fontisto';
import FeatherIcons from 'react-native-vector-icons/Feather';
import styles from './style';


const TYPES = {
  INCOGNITO: { label: 'Incognito network', value: 'Incognito' },
  ERC20: { label: 'ERC20 network', value: 'ERC20' },
  BEP2: { label: 'BEP2 network', value: 'BEP2' },
};
class AddToken extends Component {
  constructor() {
    super();

    this.state = {
      type: TYPES.INCOGNITO.value, // default
      isShowChooseType: false
    };
  }

  toggleChooseType = () => {
    this.setState(({ isShowChooseType }) => ({
      isShowChooseType: !isShowChooseType
    }));
  }

  handlePressChooseType = type => {
    this.setState({ type }, this.toggleChooseType);
  }

  render() {
    const { type, isShowChooseType } = this.state;
    return (
      <Container style={styles.container}>
        <View>
          <View style={styles.selectNetworkButtonGroup}>
            <Text style={styles.selectNetworkButtonLabel}>Select a token type</Text>
            <TouchableOpacity onPress={this.toggleChooseType} style={styles.selectNetworkButton}>
              <Text style={styles.selectNetworkValue}>{type}</Text>
              <Icons name='angle-right' style={styles.selectNetworkValueIcon} size={16} />
            </TouchableOpacity>
          </View>
          <Modal visible={isShowChooseType} close={this.toggleChooseType} containerStyle={styles.modalContainer} headerText='Select a token type'>
            <Container style={styles.typesContainer}>
              {
                Object.values(TYPES).map((TYPE, index, allType) => (
                  <>
                    <TouchableOpacity key={TYPE.value} onPress={() => this.handlePressChooseType(TYPE.value)} style={styles.typeItem}>
                      <Text>{TYPE.label}</Text>
                      {
                        type === TYPE.value && <FeatherIcons name='check' size={24} color={COLORS.primary} />
                      }
                    </TouchableOpacity>
                    {
                      (index < (allType.length - 1)) && <Divider color={COLORS.lightGrey6} />
                    }
                  </>
                ))
              }
            </Container>
          </Modal>
        </View>

        <ScrollView>
          {type === TYPES.INCOGNITO.value && <AddInternalToken />}
          {type === TYPES.BEP2.value && <AddBep2Token />}
          {type === TYPES.ERC20.value && <AddERC20Token />}
        </ScrollView>
      </Container>
    );
  }
}

export default AddToken;