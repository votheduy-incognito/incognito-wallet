import type from '@src/redux/types/settings';
import {getSettings as getSettingsAPI} from '@services/api/settings';

export const setSettings = (data) => ({
  type: type.SET_SETTINGS,
  payload: data
});

export const getSettings = () => async dispatch => {
  const settings = await getSettingsAPI();
  return dispatch(setSettings(settings));
};
