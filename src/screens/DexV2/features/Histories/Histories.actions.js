import _ from 'lodash';
import { getHistories } from '@services/api/pdefi';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@src/constants';
import { LIMIT } from '@screens/DexV2/constants';
import { accountSeleclor } from '@src/redux/selectors';
import { pairsDataSelectors } from '@screens/DexV2/features/Pairs';
import {
  ACTION_SET_LOADING,
  ACTION_SET_HISTORIES,
  ACTION_SET_PAGE,
} from './Histories.constant';
import { historiesSelector } from './Histories.selector';

export const actionSetLoading = (payload) => ({
  type: ACTION_SET_LOADING,
  payload,
});

export const actionSetHistories = (payload) => ({
  type: ACTION_SET_HISTORIES,
  payload,
});

export const actionSetPage = (payload) => ({
  type: ACTION_SET_PAGE,
  payload,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { loading, page, histories } = historiesSelector(state);
    const accounts = accountSeleclor.listAccountSelector(state);
    const { tokens } = pairsDataSelectors(state);
    if (loading || !accounts?.length || !tokens?.length) {
      return;
    }
    if (!_.isEmpty(accounts) && !_.isEmpty(tokens)) {
      dispatch(actionSetLoading(true));
      const newData = await getHistories(accounts, tokens, page, LIMIT);
      const newIds = newData.map((item) => item.id);
      const mergedData = _(newData)
        .concat(histories.filter((item) => !newIds.includes(item.id)))
        .orderBy((item) => item.id, 'desc')
        .uniqBy((item) => item.id)
        .value();
      dispatch(actionSetHistories(mergedData));
    }
  } catch (error) {
    new ExHandler(
      error,
      MESSAGES.CAN_NOT_GET_PDEX_TRADE_HISTORIES,
    ).showErrorToast();
  } finally {
    dispatch(actionSetLoading(false));
  }
};
