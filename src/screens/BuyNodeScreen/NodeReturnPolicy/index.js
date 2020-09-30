import React from 'react';
import { Text, ScrollView, View, FlexView } from '@src/components/core';
import Header from '@src/components/Header';
import { withLayout_2 } from '@components/Layout';
import theme from '@src/styles/theme';
import styles from './style';

const parts = [
  {
    id: 1,
    title: '30-day trial (United States only)',
    descriptions: [
      'If you don’t love your Node device, we’ll take it back. Simple as that. Within the first 30 days from the date of delivery, you can return Node for a full refund. We’ll even cover return shipping costs. (For orders paid in cryptocurrencies, refunded amounts will be calculated based on coinmarketcap prices at the time the refund request is approved.)\n',
      <>
        All returns require An RMA (Return Merchandise Authorization) number, issued by our Customer Service Department. Please email us at&nbsp;
        <Text style={styles.link}>go@incognito.org</Text>
        {' to discuss and obtain our Return Authorization Number. Please do not discard the original boxes and packaging materials; you must return the product in its original packaging.\n'}
      </>,
      'The RMA number needs to be clearly visible on the exterior of the packaging. Products must be returned (and received by us) within the 30-day trial period, and must be in like-new condition. No refund will be issued if the product has been damaged, altered, or abused.\n\nNo returns will be processed after 30 days.',
    ],
  },
  {
    id: 2,
    title: '1-year warranty (United States only)',
    descriptions: [
      'All shipments should be inspected immediately upon arrival. Please make note of any damage to boxes when signing for shipment. Report any losses or damages promptly to Incognito via email: go@incognito.org. Please notify us of shipping defects within one week of delivery; we will arrange pick up and replacement of the damaged goods.\n',
      'Our standard warranty is 1 year from the date that the product is received. In the case of manufacturer’s defects, Incognito will cover the full costs of replacement or repair, as well as return shipping costs. \'Defects\' are defined as imperfections in material or workmanship that will impair the use of the product.\n',
      'Please return the defective Node device in its original box and with its original accessories – power cord, adapters, documentation and so on. It may take up to (30) days for Incognito to process repairs or replacements.\n',
      'This warranty is non-transferrable, limited to the original purchaser with proof of purchase. In no event shall Incognito be liable for incidental or consequential damages resulting from the use of the product. This warranty does not cover:\n',
      '(1) Defects caused by improper assembly; (2) Defects occurring after purchase due to product modification, intentional damage, accident, misuse, abuse or negligence; (3) Normal wear and tear; (4) Water or fire damage; (5) Acts of god (including, without limitation, earthquake, flood, hurricane, lightning, or tornado) or other external causes.\n',
      'If it is determined that the mechanical breakdown was caused by misuse or abuse of the product, replacements and return shipping will be at the customer’s expense.\n',
      'No refunds are available after the initial 30-day risk free trial.',
    ]
  },
];

const NodeReturnPolicy = () => (
  <FlexView>
    <Header title="Returns & warranty policy" />
    <ScrollView paddingBottom style={styles.content}>
      {parts.map(item => (
        <View key={item.id}>
          <Text style={styles.title}>
            {item.title}
          </Text>
          {item.descriptions.map((text, index) => (
            <Text style={[styles.text, theme.text.regularSizeMediumFontGrey]} key={index}>
              {text}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  </FlexView>
);

export default React.memo(withLayout_2(NodeReturnPolicy));
