import { defaultAccountSelector } from '@src/redux/selectors/account';
import { getStatusData, getTypeData } from '@components/HistoryList/HistoryList.utils';
import appConstant from '@src/constants/app';
import { combineHistory } from '@src/redux/utils/token';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import historyModel from '@models/history';
import _ from 'lodash';

const combineHistoryStyle = (state, history) => {
  const account       = defaultAccountSelector(state);
  const {
    statusMessage,
    statusColor
  } = getStatusData(history);
  const { typeText } = getTypeData(
    history.type,
    history,
    account?.paymentAddress,
  );
  return {
    history,
    statusMessage,
    statusColor,
    typeText,
    showReload: appConstant.STATUS_MESSAGE.FAILED === statusMessage
  };
};

export const combineHistoryDetail = (state, historyId) => {
  const { histories } = state?.token?.history;
  const history       = histories.find(history => history.id === historyId);
  return combineHistoryStyle(state, history);
};

export const combineHistoryApi = (state, historyFromApi) => {
  const selectedPrivacy = selectedPrivacySeleclor.selectedPrivacy(state);
  const histories = combineHistory({
    histories: [],
    historiesFromApi: [historyModel.parsePrivateTokenFromApi(historyFromApi)],
    symbol: selectedPrivacy?.symbol,
    externalSymbol: selectedPrivacy?.externalSymbol,
    decimals: selectedPrivacy?.decimals,
    pDecimals: selectedPrivacy?.pDecimals,
  });
  return combineHistoryStyle(state, _.head(histories));
};