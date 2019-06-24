import type from '@src/redux/types/selectedPrivacy';

export const setSelectedPrivacy = (privacyToken = throw new Error('Privacy token object is required')) => ({
  type: type.SET,
  data: privacyToken
});
