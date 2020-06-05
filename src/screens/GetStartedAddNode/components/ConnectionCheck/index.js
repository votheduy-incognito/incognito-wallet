import PropTypes from 'prop-types';
import { Button, Text, Image, ScrollView, View } from '@src/components/core';
import nodeStep1 from '@src/assets/images/wifi.png';
import React, { PureComponent } from 'react';
import styles from '../../styles';
import Guide from './Guide';

class ConnectionCheck extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { onNext } = this.props;
    return (
      <ScrollView>
        <Text style={styles.title2}>Please wait for Node to show up in your network list, then tap Next</Text>
        <View style={styles.content}>
          <Image
            style={styles.content_step4_image}
            source={nodeStep1}
          />
        </View>
        <Guide />
        <View style={styles.footer}>
          <Button
            onPress={onNext}
            title="Next"
          />
        </View>
      </ScrollView>
    );
  }
}

ConnectionCheck.propTypes = {
  onNext: PropTypes.func.isRequired,
  goToScreen: PropTypes.func.isRequired,
};

export default ConnectionCheck;
