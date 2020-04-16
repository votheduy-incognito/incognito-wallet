import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import {useNavigationParam} from 'react-navigation-hooks';
import {COLORS, FONT} from '@src/styles';
import PropTypes from 'prop-types';
import {OpenByWebIcon} from '@src/components/Icons';
import LinkingService from '@src/services/linking';

const styled = StyleSheet.create({
  container: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.lightGrey2,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
  },
  title: {
    flex: 2,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 6,
    color: COLORS.lightGrey1,
  },
  desc: {
    flex: 4,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 6,
    color: COLORS.black,
  },
});

const Item = props => {
  const {title, desc, color, icon, onPressItem} = props;
  if (!desc) {
    return null;
  }
  return (
    <TouchableWithoutFeedback onPress={onPressItem}>
      <View style={styled.item}>
        <Text style={styled.title}>{title}</Text>
        <Text
          style={[styled.desc, {color}]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {desc}
        </Text>
        {icon}
      </View>
    </TouchableWithoutFeedback>
  );
};

const Detail = () => {
  const data = useNavigationParam('data');
  return (
    <View style={styled.container}>
      <Item title="ID:" desc={data?.id} />
      {!!data?.incognitoTx && (
        <Item
          title="TxID:"
          desc={data?.txLink}
          icon={<OpenByWebIcon />}
          onPressItem={() => LinkingService.openUrl(data?.txLink)}
        />
      )}
      <Item title="Status:" desc={data?.status} color={data?.statusColor} />
      <Item title="Amount:" desc={`${data?.amount} ${data?.symbol}`} />
      <Item title="Time:" desc={data?.createdAt} />
      <Item title="Type:" desc={data?.type} />
      <Item title="User ID:" desc={data?.userId} />
      <Item title="Payment Address: " desc={data?.paymentAddress} />
    </View>
  );
};

Item.defaultProps = {
  color: COLORS.black,
  onPressItem: () => null,
  icon: null,
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  color: PropTypes.string,
  onPressItem: PropTypes.func,
  icon: PropTypes.element,
};

Detail.propTypes = {};

export default Detail;
