import {
  ACTION_SHOW_WIZARD_FETCHING,
  ACTION_SHOW_WIZARD_FETCHED,
} from './GetStarted.constant';

export const actionShowWizardFetching = () => ({
  type: ACTION_SHOW_WIZARD_FETCHING,
});

export const actionShowWizardFetched = () => ({
  type: ACTION_SHOW_WIZARD_FETCHED,
});
