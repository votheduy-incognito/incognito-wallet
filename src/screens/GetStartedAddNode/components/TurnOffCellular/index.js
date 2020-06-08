import PropTypes from 'prop-types';
import {Button, Text, Image, ScrollView, View} from '@src/components/core';
import nodeStep3Android from '@src/assets/images/node/node_setup_step3_android.png';
import nodeStep3IOS from '@src/assets/images/node/node_setup_step3_ios.png';
import nodeStep32IOS from '@src/assets/images/node/node_setup_step32_ios.png';
import React from 'react';
import {isIOS} from '@utils/platform';
import Guide from './Guide';
import styles from '../../styles';

const topImage = isIOS() ? nodeStep3IOS : nodeStep3Android;
const controlName = isIOS() ? 'Control center' : 'Status bar';
const bottomImage = isIOS() ? nodeStep32IOS : null;

const TurnOffCellular = ({ onNext }) => (
  <ScrollView>
    <Text style={styles.title2}>Turn off mobile data</Text>
    <View>
      <Image
        style={styles.content_step3_image}
        source={topImage}
      />
      <Text style={styles.centerText}>{controlName}</Text>
      <View style={styles.divider} />
      { !!bottomImage && (
        <Image
          style={styles.content_step2_image}
          source={bottomImage}
        />
      ) }
      <Guide />
    </View>
    <View style={styles.footer}>
      <Button
        onPress={onNext}
        title="Next"
      />
    </View>
  </ScrollView>
);

TurnOffCellular.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default TurnOffCellular;
