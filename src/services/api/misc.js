import http from '@src/services/http';
import FunctionConfigModel from '@models/function';

const getMinMaxDepositWithdrawAmount = () => {
  // cache
  let data = null;

  const defaultAmount = amount => {
    const parsedAmount = Number(amount);

    if (Number.isFinite(parsedAmount) && parsedAmount > 0) return parsedAmount;

    return null;
  };

  return async function(tokenId) {
    const find = (tokenId) => {
      const found = data.find(item => item.tokenId === tokenId);
      return [defaultAmount(found?.minAmount), defaultAmount(found?.maxAmount)];
    };

    if (!data) {
      const result = await http.get('service/min-max-amount');
      data = result?.map(item => ({
        tokenId: item?.TokenID,
        symbol: item?.Symbol,
        pSymbol: item?.PSymbol,
        minAmount: item?.MinAmount,
        maxAmount: item?.MaxAmount
      }));

      return find(tokenId);
    } else {
      return find(tokenId);
    }
  };
};

export const getMinMaxDepositAmount = getMinMaxDepositWithdrawAmount();
export const getMinMaxWithdrawAmount = getMinMaxDepositAmount;

export const getFunctionConfigs = () => {
  return http.get('/system/disable-function-configs')
    .then(data => Object.keys(data).map(key => new FunctionConfigModel(data[key])));
};
