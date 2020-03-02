import React from 'react';
import Deposit from '@src/components/Deposit';
import withLayout from '@components/Layout/index';
import DepositAmount from '@components/DepositAmount';

const Shield = () => {
  const [amount, setAmount] = React.useState(0);

  const handleShield = (value) => {
    setAmount(value);
  };

  if (amount) {
    const Layout = withLayout(Deposit);
    return (
      <Layout amount={amount} />
    );
  }

  const LayoutInput = withLayout(DepositAmount);

  return (
    <LayoutInput onComplete={handleShield} showGuide />
  );
};

export default Shield;
