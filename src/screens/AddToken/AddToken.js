import React, { Component } from 'react';
import { View, Picker, Container, Text, ScrollView } from '@src/components/core';
import AddERC20Token from '@src/components/AddERC20Token';
import AddBep2Token from '@src/components/AddBep2Token';
import AddInternalToken from '@src/components/AddInternalToken';
import styles from './style';

const TYPES = {
  INCOGNITO: { label: 'Incognito network', value: 'INCOGNITO' },
  ERC20: { label: 'ERC20 network', value: 'ERC20' },
  BEP2: { label: 'BEP2 network', value: 'BEP2' },
};
class AddToken extends Component {
  constructor() {
    super();

    this.state = {
      type: TYPES.INCOGNITO.value // default
    };
  }

  render() {
    const { type } = this.state;
    return (
      <Container style={styles.container}>
        <View>
          <Text>Select a network</Text>
          <Picker
            selectedValue={type}
            style={styles.picker}
            onValueChange={
              (type) =>
                this.setState({ type })
            }
          >
            {
              Object.values(TYPES).map(TYPE => (
                <Picker.Item label={TYPE.label} value={TYPE.value} key={TYPE.value} />
              ))
            }
          </Picker>
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