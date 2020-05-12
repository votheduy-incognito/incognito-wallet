import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Header from '@src/components/Header';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { BtnGrey } from '@src/components/Button';
import { shieldDataSelector } from '@screens/Shield/Shield.selector';
import { SquareQuestionIcon } from '@src/components/Icons/';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import PropTypes from 'prop-types';
import SimpleInfo from '@src/components/SimpleInfo';
import Icons from 'react-native-vector-icons/AntDesign';
import { Button } from '@src/components/core';
import withGenQRCode from './GenQRCode.enhance';
import { styled } from './GenQRCode.styled';

const NormalText = props => {
  const { text } = props;
  return <Text style={styled.text}>{text}</Text>;
};

const Extra = props => {
  const { address } = useSelector(shieldDataSelector);
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const { hasError, handleShield } = props;
  if (hasError) {
    return (
      <SimpleInfo
        icon={<Icons name="exclamationcircleo" style={styled.errorIcon} />}
        type="success"
        text="Sorry, we can not process your deposit request right now, please try again."
        subText="If this problem still happening, please come back after 60 minutes."
        button={<Button title="Try again" onPress={handleShield} isAsync />}
      />
    );
  }
  return (
    <View style={styled.extra}>
      <View style={styled.qrCode}>
        <QrCodeGenerate value={address} size={175} />
      </View>
      <NormalText
        text={`Make your ${selectedPrivacy?.externalSymbol} private by sending it\n to this shielding address.`}
      />
      <View style={styled.hook}>
        <SquareQuestionIcon style={styled.questionIcon} />
        <NormalText
          text={'Use this address only once.\n It will expire in 60 minutes.'}
        />
      </View>
    </View>
  );
};

const GenQRCode = props => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const { onCopyAddress, hasError } = props;
  return (
    <View style={styled.container}>
      <Header
        title={`Shield ${selectedPrivacy?.externalSymbol}`}
        titleStyled={styled.titleStyled}
        rightHeader={
          hasError ? null : <BtnGrey title="Copy" onPress={onCopyAddress} />
        }
      />
      <ScrollView style={styled.scrollview}>
        <Extra {...props} />
      </ScrollView>
    </View>
  );
};

NormalText.propTypes = {
  text: PropTypes.string.isRequired,
};

Extra.propTypes = {
  handleShield: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
};

GenQRCode.propTypes = {
  onCopyAddress: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
};

export default withGenQRCode(GenQRCode);
