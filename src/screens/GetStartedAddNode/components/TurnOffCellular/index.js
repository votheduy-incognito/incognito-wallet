import PropTypes from 'prop-types';
import { Text, Image, View, RoundCornerButton } from '@src/components/core';
import turn_off_cellular from '@src/assets/images/node/turn_off_cellular.png';
import React from 'react';
import theme from '@src/styles/theme';
import Guide from './Guide';
import styles from '../../styles';

const TurnOffCellular = ({ onNext }) => (
  <View>
    <Text style={styles.title2}>Turn off mobile data.</Text>
    <View>
      <Image
        style={styles.content_step3_image}
        source={turn_off_cellular}
        resizeMode="contain"
        resizeMethod="resize"
      />
      <Guide />
    </View>
    <View style={styles.footer}>
      <RoundCornerButton
        style={[theme.BUTTON.NODE_BUTTON]}
        onPress={onNext}
        title="Next"
      />
    </View>
  </View>
);

TurnOffCellular.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default TurnOffCellular;
