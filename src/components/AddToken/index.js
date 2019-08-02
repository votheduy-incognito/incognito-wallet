import React, { useState } from 'react';
import { View, CheckBox } from '../core';
import AddERC20Token from '../AddERC20Token';
import AddInternalToken from '../AddInternalToken';
import styles from './style';

const AddToken = () => {
  const [isCreateErc20Token, setCreateErc20Token] = useState(false);

  return (
    <View style={styles.container}>
      <CheckBox
        containerStyle={styles.switchCheckbox}
        value={isCreateErc20Token}
        label='Create ERC20 Token'
        onValueChange={setCreateErc20Token}
      />
      {
        isCreateErc20Token ? <AddERC20Token /> : <AddInternalToken />
      }
    </View>
  );
};

export default AddToken;