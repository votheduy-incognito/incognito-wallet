import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Header from '@src/components/Header';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { COLORS, FONT } from '@src/styles';
import { BtnGrey } from '@src/components/Button';
import { shieldDataSelector } from '@screens/Shield/Shield.selector';
import { SquareQuestionIcon } from '@src/components/Icons/';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import PropTypes from 'prop-types';
import withGenQRCode from './GenQRCode.enhance';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  extra: {
    alignItems: 'center',
    flex: 1,
  },
  titleStyled: {
    textTransform: 'none',
  },
  text: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    textAlign: 'center',
    marginVertical: 40,
  },
});

const NormalText = props => {
  const { text } = props;
  return <Text style={styled.text}>{text}</Text>;
};

const Extra = () => {
  const { address } = useSelector(shieldDataSelector);
  return (
    <ScrollView>
      <View style={styled.extra}>
        <QrCodeGenerate value={address} size={175} />
        <NormalText
          text={
            'Make your BTC private by sending it\n to this shielding address.'
          }
        />
        <SquareQuestionIcon />
        <NormalText
          text={'Use this address only once.\n It will expire in 60 minutes.'}
        />
      </View>
    </ScrollView>
  );
};

const GenQRCode = props => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const { onCopyAddress } = props;
  return (
    <View style={styled.container}>
      <Header
        title={`Shield ${selectedPrivacy?.symbol || selectedPrivacy?.pSymbol}`}
        titleStyled={styled.titleStyled}
        rightHeader={<BtnGrey title="Copy" onPress={onCopyAddress} />}
      />
      <Extra />
    </View>
  );
};

GenQRCode.propTypes = {
  onCopyAddress: PropTypes.func.isRequired,
};

export default withGenQRCode(GenQRCode);
