import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import TradeSuccessModal from '@screens/DexV2/components/TradeSuccessModal';
import { tradeSelector } from '@screens/DexV2/features/Trade';
import { useSelector } from 'react-redux';

const withSuccess = (WrappedComp) => (props) => {
  const [tradeSuccess, setTradeSuccess] = React.useState(false);
  const navigation = useNavigation();
  const { inputText, inputToken, outputToken, minimumAmount } = useSelector(
    tradeSelector,
  );
  const closeSuccess = () => {
    setTradeSuccess(false);
    navigation.goBack();
  };
  return (
    <>
      <WrappedComp
        {...{
          ...props,
          onTradeSuccess: setTradeSuccess,
        }}
      />
      <TradeSuccessModal
        closeSuccessDialog={closeSuccess}
        inputToken={inputToken}
        inputValue={inputText}
        outputToken={outputToken}
        outputValue={minimumAmount}
        visible={tradeSuccess}
      />
    </>
  );
};

export default withSuccess;
