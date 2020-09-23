import isArray from 'lodash/isArray';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
} from './Home.constant';
import { apiGetHomeConfigs, apiGetAppVersion } from './Home.services';
import { HOME_CONFIGS, checkOutdatedVersion } from './Home.utils';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFetch = () => async (dispatch, getState) => {
  const { defaultConfigs, isFetching } = getState()?.home;
  if (isFetching) {
    return;
  }
  let appVersion;
  let outdatedVersion = false;
  let categories = isArray(defaultConfigs?.categories)
    ? defaultConfigs?.categories
    : HOME_CONFIGS.categories;
  let headerTitle = defaultConfigs?.headerTitle
    ? defaultConfigs?.headerTitle
    : HOME_CONFIGS.headerTitle;
  try {
    await dispatch(actionFetching());
    const task = [apiGetHomeConfigs(), apiGetAppVersion()];
    const [{ data }, { data: appVersionDt }] = await new Promise.all(task);
    categories = data?.categories || [];
    headerTitle = data?.headerTitle?.title.replace('\\n', '\n') || '';
    appVersion = appVersionDt?.Result;
    if (appVersion && appVersion?.Version) {
      outdatedVersion = checkOutdatedVersion(appVersion?.Version);
    }
  } catch (error) {
    console.debug('error', error);
  } finally {
    await dispatch(
      actionFetched({
        configs: {
          categories,
          headerTitle,
        },
        appVersion: { ...appVersion, outdatedVersion },
      }),
    );
  }
};
