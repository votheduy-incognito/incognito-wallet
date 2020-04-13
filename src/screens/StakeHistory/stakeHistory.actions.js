import {pStakeAccountSelector} from '@screens/Stake/stake.selector';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_CHANGE_PAGE,
} from './stakeHistory.constant';
import {api} from './stakeHistory.services';
import {stakeHistorySelector} from './stakeHistory.selector';
import {mappingData} from './stakeHistory.utils';

export const actionChangePage = payload => ({
  type: ACTION_CHANGE_PAGE,
  payload,
});

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = payload => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFetch = ({loadmore = true}) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const {isFetching, data} = stakeHistorySelector(state);
    const {page: pageCurrent, limit, items: oldItems, over} = data;
    if (isFetching && over) {
      return;
    }
    const {PaymentAddress} = pStakeAccountSelector(state);
    const page = loadmore ? pageCurrent : 1;
    await dispatch(actionFetching());
    const {Items} = await api({
      paymentAddress: PaymentAddress,
      page,
      limit,
    });
    const items = loadmore
      ? [...oldItems, ...mappingData(Items)]
      : [...mappingData(Items)];
    const payload = {
      items: [...new Set(items)],
      over: Items.length < limit,
      page,
    };
    await dispatch(actionFetched(payload));
  } catch (error) {
    await dispatch(actionFetchFail());
  }
};
