import React from 'react';
import {View, Text} from 'react-native';
import {COLORS} from '@src/styles';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import PropTypes from 'prop-types';
import {Divider, Button} from '@src/components/core';
import {styledReceipt as styled} from './Withdraw.styled';
import withReceipt from './Withdraw.withReceipt';

const Hook = ({label, desc}) => {
  return (
    <View style={styled.hook}>
      <Text style={styled.label} ellipsizeMode="middle" numberOfLines={1}>
        {`${label}:`}
      </Text>
      <Text style={styled.desc} ellipsizeMode="middle" numberOfLines={1}>
        {desc}
      </Text>
    </View>
  );
};

const ReceiptModal = props => {
  const {infoFactories, onBack, btnSaveReceiver, title} = props;
  return (
    <View style={styled.container}>
      <SimpleLineIcons name="check" size={70} color={COLORS.primary} />
      <Text style={styled.title}>{title}</Text>
      <Divider color={COLORS.lightGrey5} height={1.5} style={styled.divider} />
      <View style={styled.infoContainer}>
        {infoFactories.map((item, key) =>
          item.disabled ? null : <Hook key={key} {...item} />,
        )}
      </View>
      <Divider color={COLORS.lightGrey5} height={1.5} style={styled.divider} />
      <Button
        style={styled.backButton}
        title="Go back to Assets"
        onPress={onBack}
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
