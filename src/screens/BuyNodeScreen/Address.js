import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from '@components/core';
import theme from '@src/styles/theme';
import routeNames from '@routers/routeNames';
import NavigationService from '@services/NavigationService';
import SubItem from '@screens/BuyNodeScreen/SubItem';
import Row from '@components/Row';
import BtnWithBlur from '@components/Button/BtnWithBlur';

const Address = ({ contactData, onUpdateAddress }) => {
  const handleUpdateAddress = () => {
    NavigationService.navigate(routeNames.DestinationBuyNode, {
      updateAddressF: (data) => {
        onUpdateAddress(data);
        setTimeout(() => {
          NavigationService.goBack();
        }, 200);
      },
      data: contactData?.address ? contactData : undefined
    });
  };

  return (
    <View style={theme.MARGIN.marginTopDefault}>
      <View>
        <Row center spaceBetween>
          <Text style={[theme.text.defaultTextStyle, theme.FLEX.alignViewSelfCenter, theme.text.mediumTextBold]}>Destination</Text>
          <BtnWithBlur text={contactData?.address ? 'Change' : 'Add'} onPress={handleUpdateAddress} />
        </Row>
        {contactData?.address && (
          <SubItem
            marginTop={5}
            description={`${contactData?.address}, ${contactData?.city}, ${contactData?.region}, ${contactData?.country}`}
          />
        )}
      </View>
    </View>
  );
};

Address.propTypes = {
  onUpdateAddress: PropTypes.func.isRequired,
  contactData: PropTypes.object.isRequired,
};

export default Address;
