import PropTypes from 'prop-types';
import { Text, Image, View, RoundCornerButton } from '@src/components/core';
import nodeStep1 from '@src/assets/images/wifi.png';
import React, { PureComponent } from 'react';
import theme from '@src/styles/theme';
import styles from '../../styles';

class ConnectionCheck extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { onNext } = this.props;
    return (
      <View>
        <Text style={styles.title2}>{'Please wait for Node to appear\nin your network list, then tap Next.'}</Text>
        <View>
          <Image
            style={styles.content_step4_image}
            source={nodeStep1}
            resizeMode="contain"
            resizeMethod="resize"
          />
        </View>
        <View style={styles.footer}>
          <RoundCornerButton
            onPress={onNext}
            title="Next"
            style={[theme.BUTTON.NODE_BUTTON]}
          />
        </View>
      </View>
    );
  }
}

ConnectionCheck.propTypes = {
  onNext: PropTypes.func.isRequired,
  goToScreen: PropTypes.func.isRequired,
};

export default ConnectionCheck;
