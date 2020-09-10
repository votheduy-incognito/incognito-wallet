import {
  ACTION_TOGGLE_TEST_MODE_CENTRALIZED,
  ACTION_TOGGLE_TEST_MODE_DECENTRALIZED,
} from './Dev.constant';

export const actionToggleTestModeCentralized = () => ({
  type: ACTION_TOGGLE_TEST_MODE_CENTRALIZED,
});

export const actionToggleTestModeDecentralized = () => ({
  type: ACTION_TOGGLE_TEST_MODE_DECENTRALIZED,
});
