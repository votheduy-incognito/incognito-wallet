import type from '@src/redux/types/selectedPrivacy';

export const setSelectedPrivacy = (privacySymbol = throw new Error('Privacy symbol is required')) => ({
  type: type.SET,
  data: privacySymbol
});

export const clearSelectedPrivacy = () => ({
  type: type.CLEAR,
});
