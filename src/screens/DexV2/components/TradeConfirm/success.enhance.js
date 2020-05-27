import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import TradeSuccessModal from '@screens/DexV2/components/TradeSuccessModal';

const withSuccess = WrappedComp => (props) => {
  const [tradeSuccess, setTradeSuccess] = React.useState(false);
  const navigation = useNavigation();

  const {
    inputText,
    inputToken,
    outputToken,
    minimumAmount,
  } = props;

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
