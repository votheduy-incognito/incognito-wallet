import React from 'react';
import PropTypes from 'prop-types';
import formatUtil from '@utils/format';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import { COINS } from '@src/constants';

const PoolSize = ({ inputToken, outputToken, pair }) => {
  const empty = <ExtraInfo left="Pool size" right="Loading" />;
  if (!pair || !pair.length || !inputToken || !outputToken) {
    return empty;
  }
  if (pair.length === 1) {
    const inputPool = pair && pair[0][(inputToken?.id)];
    const outputPool = pair && pair[0][(outputToken?.id)];
    const formattedInputPool = formatUtil.amount(
      inputPool,
      inputToken?.pDecimals,
      true,
    );
    const formattedOutputPool = formatUtil.amount(
      outputPool,
      outputToken?.pDecimals,
      true,
    );
    if (!formattedInputPool || !formattedOutputPool) {
      return empty;
    }
    return (
      <ExtraInfo
        left="Pool size"
        right={`${formattedInputPool} ${inputToken?.symbol} + ${formattedOutputPool} ${outputToken?.symbol}`}
      />
    );
  }
  const inputPool1 = pair && pair[0][(inputToken?.id)];
  const outputPool1 = pair && pair[0][COINS.PRV_ID];
  const formattedInputPool1 = formatUtil.amount(
    inputPool1,
    inputToken?.pDecimals,
    true,
  );
  const formattedOutputPool1 = formatUtil.amount(
    outputPool1,
    COINS.PRV.pDecimals,
    true,
  );
  const inputPool2 = pair && pair[1][COINS.PRV_ID];
  const outputPool2 = pair && pair[1][(outputToken?.id)];
  const formattedInputPool2 = formatUtil.amount(
    inputPool2,
    COINS.PRV.pDecimals,
    true,
  );
  const formattedOutputPool2 = formatUtil.amount(
    outputPool2,
    outputToken?.pDecimals,
    true,
  );
  if (
    !formattedInputPool1 ||
    !formattedOutputPool1 ||
    !formattedInputPool2 ||
    !formattedOutputPool2
  ) {
    return empty;
  }
  return (
    <>
      <ExtraInfo
        left="Pool size"
        right={`${formattedInputPool1} ${inputToken?.symbol} + ${formattedOutputPool1} ${COINS.PRV.symbol}`}
      />
      <ExtraInfo
        left="Pool size"
        right={`${formattedInputPool2} ${COINS.PRV.symbol} + ${formattedOutputPool2} ${outputToken?.symbol}`}
      />
    </>
  );
};

PoolSize.propTypes = {
  inputToken: PropTypes.object.isRequired,
  outputToken: PropTypes.object.isRequired,
  pair: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default PoolSize;
