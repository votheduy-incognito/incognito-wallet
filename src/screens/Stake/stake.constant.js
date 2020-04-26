export const ACTION_FETCHING = '[stake] Fetching data';
export const ACTION_FETCHED = '[stake] Fetched data';
export const ACTION_FETCH_FAIL = '[stake] Fetch fail data';

export const ACTION_CHANGE_FLOW_STEP = '[stake] Change flow step';
export const ACTION_CHANGE_FLOW_ACCOUNT = '[stake] Change flow account';
export const ACTION_CHANGE_FLOW_AMOUNT = '[stake] Change flow amount';

export const DEPOSIT_FLOW = 'deposit';
export const WITHDRAW_FLOW = 'withdraw';

export const ACTION_FETCHING_FEE = '[stake] Fetching data fee';
export const ACTION_FETCHED_FEE = '[stake] Fetched data fee';
export const ACTION_FETCH_FAIL_FEE = '[stake] Fetch fail data fee';

export const ACTION_FETCHING_CREATE_STAKE =
  '[stake] Fetching data create stake';
export const ACTION_FETCHED_CREATE_STAKE = '[stake] Fetched data create stake';
export const ACTION_FETCH_FAIL_CREATE_STAKE =
  '[stake] Fetch fail data create stake';
export const ACTION_BACKUP_CREATE_STAKE = '[stake] Backup create stake';

export const ACTION_FETCHING_CREATE_UNSTAKE =
  '[stake] Fetching data create un stake';
export const ACTION_FETCHED_CREATE_UNSTAKE =
  '[stake] Fetched data create un stake';
export const ACTION_FETCH_FAIL_CREATE_UNSTAKE =
  '[stake] Fetch fail data create un stake';

export const ACTION_FETCHING_CREATE_UNSTAKE_REWARDS =
  '[stake] Fetching data create un stake rewards';
export const ACTION_FETCHED_CREATE_UNSTAKE_REWARDS =
  '[stake] Fetched data create un stake rewards';
export const ACTION_FETCH_FAIL_CREATE_UNSTAKE_REWARDS =
  '[stake] Fetch fail data create un stake rewards';

export const ACTION_TOGGLE_GUIDE = '[stake] Toggle guide home stake';

export const STEP_FLOW = {
  DEFAULT: 0,
  CHOOSE_ACCOUNT: 1,
  TYPE_AMOUNT: 2,
  SHOW_STATUS: 3,
};
