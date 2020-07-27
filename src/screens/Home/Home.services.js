import http from '@src/services/http';
import { CONSTANT_CONFIGS } from '@src/constants';

export const apiGetHomeConfigs = () =>
  http.get(CONSTANT_CONFIGS.HOME_CONFIG_DATA);
