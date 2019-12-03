// event
export const specialErc20 = (tokenId) => {
  return [
    '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0',
    '1ff2da446abfebea3ba30385e2ca99b0f0bbeda5c6371f4c23c939672b429a42',
    'd240c61c6066fed0535df9302f1be9f5c9728ef6d01ce88d525c4f6ff9d65a56',
    '9e1142557e63fd20dee7f3c9524ffe0aa41198c494aa8d36447d12e85f0ddce7',

    // testnet
    '4946b16a08a9d4afbdf416edf52ef15073db0fc4a63e78eb9de80f94f6c0852a'
  ].includes(tokenId);
};