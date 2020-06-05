import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Header from '@src/components/Header';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { shieldDataSelector } from '@screens/Shield/Shield.selector';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import PropTypes from 'prop-types';
import { CopiableTextDefault as CopiableText } from '@src/components/CopiableText';
import LoadingContainer from '@src/components/LoadingContainer';
import { ButtonBasic } from '@src/components/Button';
import { ExclamationIcon } from '@src/components/Icons';
import withGenQRCode from './GenQRCode.enhance';
import { styled } from './GenQRCode.styled';
import { useCountDown } from './GenQRCode.useEffect';

const NormalText = (props) => {
  const { text, style = null, children = null } = props;
  return (
    <Text style={[styled.text, style]}>
      {text}
      {children}
    </Text>
  );
};

const ShieldError = ({ handleShield }) => {
  return (
    <View style={styled.errorContainer}>
      <ExclamationIcon />
      <Text style={[styled.errorText, { marginTop: 30 }]}>
        {'We seem to have hit a snag. Simply\ntap to try again.'}
      </Text>
      <Text style={styled.errorText}>
        {'If that doesn’t work,\n please come back in 60 minutes.'}
      </Text>
      <ButtonBasic
        btnStyle={styled.btnRetry}
        titleStyle={styled.titleBtnRetry}
        onPress={handleShield}
        title="Try again"
      />
    </View>
  );
};

const Extra = () => {
  const { address, min } = useSelector(shieldDataSelector);
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const [remainTime] = useCountDown();
  return (
    <ScrollView style={styled.scrollview}>
      <View style={styled.extra}>
        <NormalText style={[styled.text, styled.title]}>
          {'Send to this shielding\naddress '}
          <Text style={[styled.boldText]}>once only.</Text>
        </NormalText>
        <View style={styled.qrCode}>
          <QrCodeGenerate value={address} size={175} />
        </View>
        <View style={styled.hook}>
          <NormalText text="Expires in: ">
            <Text style={[styled.boldText, styled.countdown]}>
              {remainTime}
            </Text>
          </NormalText>
          {min && (
            <NormalText text="Minimum amount: ">
              <Text style={styled.boldText}>
                {`${min} ${selectedPrivacy?.externalSymbol ||
                  selectedPrivacy?.symbol}`}
              </Text>
            </NormalText>
          )}
        </View>
        <CopiableText data={address} />
      </View>
    </ScrollView>
  );
};

const GenQRCode = (props) => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const { hasError, handleShield, isFetching } = props;
  const renderComponent = () => {
    if (isFetching) {
      return <LoadingContainer />;
    }
    if (hasError) {
      return <ShieldError handleShield={handleShield} />;
    }
    return <Extra {...props} />;
  };
  return (
    <View style={styled.container}>
      <Header
        title={`Shield ${selectedPrivacy?.externalSymbol}`}
        titleStyled={styled.titleStyled}
      />
      {renderComponent()}
    </View>
  );
};

NormalText.propTypes = {
  text: PropTypes.string.isRequired,
};

Extra.propTypes = {};

GenQRCode.propTypes = {
  hasError: PropTypes.bool.isRequired,
  handleShield: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default withGenQRCode(GenQRCode);
