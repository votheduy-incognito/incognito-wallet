import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Slippage from '@screens/DexV2/components/Trade/Components/Slippage/Slippage';
import TitleSection from '@screens/DexV2/components/Trade/Components/TitleSection/TitleSection';
import TradeInfoSimple from '@screens/DexV2/components/Trade/Components/TradeInfoSimple/TradeInfoSimple';
import Priority  from '@screens/DexV2/components/Trade/Components/Priority';

const TradeInfoPro = ({ inputBalance }) => {
  return (
    <>
      <Slippage />
      <Priority />
      <TitleSection
        title='Trade Detail'
        style={{ marginTop: 30, marginBottom: 15 }}
      />
      <TradeInfoSimple
        inputBalance={inputBalance}
      />
    </>
  );
};

TradeInfoPro.propTypes = {
  inputBalance: PropTypes.number,
};

TradeInfoPro.defaultProps = {
  inputBalance: null,
};

TradeInfoPro.propTypes = {};


export default memo(TradeInfoPro);