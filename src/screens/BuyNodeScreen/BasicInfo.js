import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, View } from '@components/core';
import theme from '@src/styles/theme';
import nodeImg from '@assets/images/node/buy_node_s.png';
import styles from '@screens/BuyNodeScreen/style';

const TOP_MOTTO_HEADER = 'A beautiful plug and play device that protects the world from surveillance. Power privacy for people. Earn crypto.';

const BasicInfo = ({ usdPrice, contactData }) => {
  return (
    <View>
      <View style={styles.containerHeader}>
        <Image style={styles.nodeImage} resizeMode="contain" source={nodeImg} />
        <View>
          <Text style={theme.text.boldTextStyleSuperMedium}>{`$${usdPrice}`}</Text>
          {contactData?.countryCode === 'US' ? (
            <>
              <Text style={[theme.text.regularSizeMediumFontGrey, { marginTop: 10 }]}>1 year warranty</Text>
              <Text style={[theme.text.regularSizeMediumFontGrey, { marginTop: 10 }]}>30-day returns</Text>
            </>
          ) : <Text style={[theme.text.regularSizeMediumFontGrey, { marginTop: 10 }]}>International shipping</Text>}
        </View>
      </View>
      <View>
        <Text style={[theme.text.regularSizeMediumFontGrey, { lineHeight: 30, marginBottom: 20 }]}>{TOP_MOTTO_HEADER}</Text>
      </View>
    </View>
  );
};

BasicInfo.propTypes = {
  usdPrice: PropTypes.number.isRequired,
  contactData: PropTypes.object.isRequired,
};

export default BasicInfo;
