import React from 'react';

export const useTokenList = () => {
  const [toggleUnVerified, setToggleUnVerified] = React.useState(false);
  const onToggleUnVerifiedTokens = () => setToggleUnVerified(!toggleUnVerified);
  return [toggleUnVerified, onToggleUnVerifiedTokens];
};
