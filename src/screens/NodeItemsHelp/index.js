import React from 'react';
import { Text, View } from '@src/components/core';
import { COLORS } from '@src/styles';
import MainLayout from '@components/MainLayout/index';
import styles from './style';

const NodeItemsHelp = () => {
  const renderItem = (text, color) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 10}}>
        <View style={{height: 28, justifyContent: 'center'}}>
          <View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: color, marginEnd: 10}} />
        </View>
        <Text style={styles.textLine}>
          {text}
        </Text>
      </View>
    );
  };
  return (
    <MainLayout header="Get to know your Node" scrollable>
      <View>
        <Text style={styles.text}>
            On this screen, you’ll see your list of Nodes, along with their statuses and reward balances.
        </Text>
      </View>
      <View>
        <Text style={styles.title}>
            What the different colors mean
        </Text>
        <View>
          {renderItem('Your Node is currently creating blocks and earning.', COLORS.blue)}
          {renderItem('Your Node is online and waiting to be selected.', COLORS.green2)}
          {renderItem('Your Node is in the process of unstaking.', COLORS.orange)}
          {renderItem('Your Node is not active. Tap on it for activation instructions.', COLORS.colorGreyBold)}
        </View>
      </View>
      <View>
        <Text style={styles.title}>
            How to withdraw rewards and view more details
        </Text>
        <Text style={styles.text}>
            Just tap on the Node to pull up a screen with more information. You’ll see your rewards balance, associated keychain, status details, instructions, explanations and more.
        </Text>
      </View>
    </MainLayout>
  );
};

export default React.memo(NodeItemsHelp);
