import React, { memo } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { withLayout_2 } from '@components/Layout';
import { COLORS, FONT } from '@src/styles';
import { sections } from '@screens/Node/components/NodeFullDisk/constants';
import Section from '@screens/Node/components/NodeFullDisk/components/Section';

const styles = StyleSheet.create({
  title: {
    marginTop: 42,
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.medium + 4,
    color: COLORS.black,
  },
});

const NodeFullDisk = () => {
  const renderSection = (section, index) => (<Section key={'section-' + index} data={section} />);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.title}>
          Your Nodes are operating behind the scenes.
        </Text>
        {sections.map(renderSection)}
      </View>
    </ScrollView>
  );
};

export default withLayout_2(memo(NodeFullDisk));