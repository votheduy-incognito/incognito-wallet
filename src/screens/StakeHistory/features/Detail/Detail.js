import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import {OpenByWebIcon} from '@src/components/Icons';
import LinkingService from '@src/services/linking';
import {BtnDefault} from '@src/components/Button';
import {COLORS} from '@src/styles';
import {createStakeSelector} from '@src/screens/Stake/stake.selector';
import {useSelector} from 'react-redux';
import {styled} from './Detail.styled';
import withDetail from './Detail.enhance';

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

const Detail = props => {
  const {handleRetryDeposit, data} = props;
  const {isFetching} = useSelector(createStakeSelector);
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
      {!!data?.retryDeposit && (
        <BtnDefault
          title={`Retry deposit${isFetching ? '...' : ''}`}
          btnStyle={styled.btnRetry}
          onPress={handleRetryDeposit}
          loading={isFetching}
          disabled={isFetching}
        />
      )}
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

Detail.propTypes = {
  handleRetryDeposit: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
};

export default withDetail(Detail);
