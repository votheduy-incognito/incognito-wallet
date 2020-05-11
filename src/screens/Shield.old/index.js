import React from 'react';
import Deposit from '@src/components/Deposit';
import ROUTES_NAME from '@routers/routeNames';
import { BtnQuestion } from '@src/components/Button';
import withLayout from '@components/Layout/index';
import DepositAmount from '@components/DepositAmount';

const Shield = ({ navigation }) => {
  Shield.navigationOptions = {
    headerRight: <BtnQuestion onPress={() => navigation.navigate(ROUTES_NAME.WhyShield)} />
  };
  const [amount, setAmount] = React.useState(null);

  const handleShield = (value) => {
    setAmount(value);
  };

  if (amount === 0) {
    const Layout = withLayout(Deposit);
    return (
      <Layout amount={amount} />
    );
  }

  const LayoutInput = withLayout(DepositAmount);

  return (
    <LayoutInput onComplete={handleShield} showGuide={false} />
  );
};

export default Shield;
