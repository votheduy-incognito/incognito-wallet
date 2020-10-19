import {
  ACTION_TOGGLE_TEST_MODE_CENTRALIZED,
  ACTION_TOGGLE_TEST_MODE_DECENTRALIZED,
  ACTION_TOGGLE_UTXOS,
  ACTION_DEV_TEST_TOGGLE_HISTORY_DETAIL,
  ACTION_TOGGLE_LOG_APP,
} from './Dev.constant';

export const actionToggleTestModeCentralized = () => ({
  type: ACTION_TOGGLE_TEST_MODE_CENTRALIZED,
});

export const actionToggleTestModeDecentralized = () => ({
  type: ACTION_TOGGLE_TEST_MODE_DECENTRALIZED,
});

export const actionToggleUTXOs = () => ({
  type: ACTION_TOGGLE_UTXOS,
});

export const actionToggleHistoryDetail = () => ({
  type: ACTION_DEV_TEST_TOGGLE_HISTORY_DETAIL,
});

export const actionToggleLogApp = () => ({
  type: ACTION_TOGGLE_LOG_APP,
});
