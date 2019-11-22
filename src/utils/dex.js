export const DEX = {
  MAIN_ACCOUNT: 'pDEX',
  WITHDRAW_ACCOUNT: 'pDEXWithdraw',
};

export default {
  isDEXAccount(accountName) {
    if (!accountName) {
      return false;
    }

    const name = accountName.toLowerCase();
    return name === DEX.WITHDRAW_ACCOUNT.toLowerCase() || name === DEX.MAIN_ACCOUNT.toLowerCase();
  },

  isDEXMainAccount(accountName) {
    if (!accountName) {
      return false;
    }

    const name = accountName.toLowerCase();
    return name === DEX.MAIN_ACCOUNT.toLowerCase();
  },

  isDEXWithdrawAccount(accountName) {
    if (!accountName) {
      return false;
    }

    const name = accountName.toLowerCase();
    return name === DEX.WITHDRAW_ACCOUNT.toLowerCase();
  },
};
