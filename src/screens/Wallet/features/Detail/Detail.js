import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import Header from '@src/components/Header';
import {
  selectedPrivacySeleclor,
  sharedSeleclor,
  tokenSeleclor,
} from '@src/redux/selectors';
import { useSelector } from 'react-redux';
import { ButtonBasic } from '@src/components/Button';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import {
  Amount,
  AmountBasePRV,
  ChangePrice,
} from '@src/components/Token/Token';
import HistoryToken from '@screens/Wallet/features/HistoryToken';
import MainCryptoHistory from '@screens/Wallet/features/MainCryptoHistory';
import PropTypes from 'prop-types';
import withDetail from './Detail.enhance';
import {
  styled,
  groupBtnStyled,
  balanceStyled,
  historyStyled,
} from './Detail.styled';

const RightHeader = () => {
  return (
    <ButtonBasic
      title="Trade"
      btnStyle={styled.btnTrade}
      titleStyle={styled.titleBtnTrade}
    />
  );
};

const GroupButton = () => {
  const navigation = useNavigation();
  const handleShield = () => navigation.navigate(routeNames.SendCrypto);
  const handleUnShield = () => navigation.navigate(routeNames.SendCrypto);
  return (
    <View style={groupBtnStyled.groupButton}>
      <ButtonBasic
        title="Send"
        btnStyle={groupBtnStyled.btnStyle}
        titleStyle={groupBtnStyled.titleStyle}
        onPress={handleShield}
      />
      <ButtonBasic
        title="Receive"
        btnStyle={groupBtnStyled.btnStyle}
        titleStyle={groupBtnStyled.titleStyle}
        onRefresh={handleUnShield}
      />
    </View>
  );
};

const Balance = () => {
  const selected = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const isGettingBalance = useSelector(
    sharedSeleclor.isGettingBalance,
  ).includes(selected?.tokenId);
  const tokenData = {
    ...selected,
    isGettingBalance,
  };
  const amountProps = {
    customStyle: balanceStyled.amount,
    ...tokenData,
    showSymbol: false,
  };
  const amountBasePRVProps = {
    customStyle: [balanceStyled.hookCustomStyle, balanceStyled.amountBasePRV],
    ...tokenData,
  };
  const changePriceProps = {
    customStyle: [balanceStyled.hookCustomStyle, balanceStyled.changePrice],
    ...tokenData,
  };
  return (
    <View style={balanceStyled.container}>
      <Amount {...amountProps} />
      <View style={balanceStyled.hook}>
        <AmountBasePRV {...amountBasePRVProps} />
        <ChangePrice {...changePriceProps} />
      </View>
    </View>
  );
};

const History = () => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  return (
    <View style={historyStyled.container}>
      {selectedPrivacy?.isToken && <HistoryToken />}
      {selectedPrivacy?.isMainCrypto && <MainCryptoHistory />}
    </View>
  );
};

const Detail = props => {
  const { handleLoadHistory } = props;
  const selected = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const { isFetching } = useSelector(tokenSeleclor.historyTokenSelector);
  return (
    <View style={styled.container}>
      <Header title={selected?.name} rightHeader={<RightHeader />} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={(
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleLoadHistory}
          />
        )}
      >
        <Balance />
        <GroupButton />
        <History />
      </ScrollView>
    </View>
  );
};

Detail.propTypes = {
  handleLoadHistory: PropTypes.func.isRequired,
};

export default withDetail(Detail);
