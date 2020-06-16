import React from 'react';
import { View, Text, Clipboard } from 'react-native';
import Header from '@src/components/Header';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import format from '@src/utils/format';
import { CONSTANT_CONFIGS } from '@src/constants';
import { ScrollView, TouchableOpacity, Toast } from '@src/components/core';
import LinkingService from '@src/services/linking';
import { CopyIcon, OpenUrlIcon } from '@src/components/Icons';
import PropTypes from 'prop-types';
import { COLORS } from '@src/styles';
import { TokenBasic } from '@src/components/Token';
import { styled } from './CoinInfo.styled';
import withCoinInfo from './CoinInfo.enhance';

const InfoItem = ({ label, value, copyable, link, onlyLabel, labelStyle }) => {
  const renderComponent = () => (
    <View style={styled.infoContainer}>
      {!!label && <Text style={[styled.label, labelStyle]}>{label}</Text>}
      {!!value && (
        <Text numberOfLines={1} ellipsizeMode="middle" style={styled.value}>
          {value}
        </Text>
      )}
      {copyable && <CopyIcon />}
      {!!link && <OpenUrlIcon />}
    </View>
  );
  const handleCopyText = () => {
    Clipboard.setString(value);
    Toast.showInfo('Copied');
  };

  const handleOpenUrl = () => LinkingService.openUrl(link);
  if (!value && !onlyLabel) {
    return null;
  }
  if (copyable) {
    return (
      <TouchableOpacity onPress={handleCopyText}>
        {renderComponent()}
      </TouchableOpacity>
    );
  }
  if (link) {
    return (
      <TouchableOpacity onPress={handleOpenUrl}>
        {renderComponent()}
      </TouchableOpacity>
    );
  }
  return renderComponent();
};

const CoinInfo = (props) => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const { info } = props;
  console.log('info', info);
  if (!selectedPrivacy) {
    return null;
  }
  const {
    name,
    symbol,
    externalSymbol,
    isVerified,
    isBep2Token,
    tokenId,
    contractId,
    amount,
    pDecimals,
    incognitoTotalSupply,
    networkName,
  } = selectedPrivacy;
  const infosFactories = [
    {
      label: isVerified ? 'Verified' : 'Unverified',
      onlyLabel: true,
      labelStyle: isVerified
        ? { color: COLORS.green }
        : { color: COLORS.orange },
    },
    {
      label: 'Balance',
      value: format.amount(amount, pDecimals),
    },
    {
      label: 'Origin',
      value: `${networkName} network`,
    },
    {
      label: 'Coin ID',
      value: tokenId,
      copyable: true,
    },
    {
      label: 'Contract ID',
      value: contractId,
      copyable: true,
      link: `${CONSTANT_CONFIGS.ETHERSCAN_URL}/token/${contractId}`,
    },
    {
      label: 'Coin supply',
      value: incognitoTotalSupply
        ? format.amount(incognitoTotalSupply, pDecimals)
        : null,
    },
    {
      label: 'Owner name',
      value: info?.ownerName,
      copyable: true,
    },
    {
      label: 'Owner address',
      value: info?.ownerAddress,
      copyable: true,
    },
    { label: 'Owner email', value: info?.ownerEmail, copyable: true },
    {
      label: 'Owner website',
      value: info?.ownerWebsite,
      link: info?.ownerWebsite,
      copyable: true,
    },
  ];

  return (
    <View style={styled.container}>
      <Header title="Coin info" />
      <View style={styled.wrapper}>
        <ScrollView>
          <TokenBasic tokenId={tokenId} style={styled.token} />
          {infosFactories.map((info, key) => (
            <InfoItem {...info} key={key} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

CoinInfo.propTypes = {
  info: PropTypes.object,
};

CoinInfo.defaultProps = {
  info: null,
};

InfoItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  copyable: PropTypes.bool,
  link: PropTypes.string,
  labelStyle: PropTypes.any,
  onlyLabel: PropTypes.bool,
};

InfoItem.defaultProps = {
  label: '',
  value: '',
  link: '',
  labelStyle: null,
  copyable: false,
  onlyLabel: false,
};

export default withCoinInfo(CoinInfo);
