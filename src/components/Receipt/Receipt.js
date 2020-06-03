import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '@src/styles';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import PropTypes from 'prop-types';
import { ButtonBasic } from '@src/components/Button';
import { TouchableOpacity } from '@src/components/core';
import linkingService from '@src/services/linking';
import IconOpenUrl from '@src/components/Icons/icon.openUrl';
import { styled } from './Receipt.styled';
import withReceipt from './Receipt.enhance';

const Hook = ({ label, desc, renderTx = false }) => {
  const handleOpenUrl = () => linkingService.openUrl(desc);
  let renderComponent = () => (
    <View style={styled.hook}>
      <Text style={styled.label} ellipsizeMode="middle" numberOfLines={1}>
        {`${label}:`}
      </Text>
      <Text style={styled.desc} ellipsizeMode="middle" numberOfLines={1}>
        {desc}
      </Text>
      {renderTx && <IconOpenUrl />}
    </View>
  );
  if (renderTx) {
    return (
      <TouchableOpacity onPress={handleOpenUrl}>
        {renderComponent()}
      </TouchableOpacity>
    );
  }
  return renderComponent();
};

const ReceiptModal = props => {
  const { infoFactories, onBack, btnSaveReceiver, title } = props;
  return (
    <View style={styled.container}>
      <SimpleLineIcons name="check" size={60} color={COLORS.colorGrey} />
      <Text style={styled.title}>{title}</Text>
      <View style={styled.infoContainer}>
        {infoFactories.map((item, key) =>
          item.disabled ? null : <Hook key={key} {...item} />,
        )}
      </View>
      <ButtonBasic
        btnStyle={styled.backButton}
        title="Back to coin details"
        onPress={onBack}
        titleStyle={styled.titleBtn}
      />
      {btnSaveReceiver}
    </View>
  );
};

Hook.propTypes = {
  label: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

ReceiptModal.defaultProps = {
  btnSaveReceiver: null,
};

ReceiptModal.propTypes = {
  infoFactories: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  btnSaveReceiver: PropTypes.any,
  title: PropTypes.string.isRequired,
};

export default withReceipt(ReceiptModal);
