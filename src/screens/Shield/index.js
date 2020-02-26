import React from 'react';
import Deposit from '@src/components/Deposit';
import withLayout from '@components/Layout/index';
import DepositAmount from './DepositAmount';

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

  return (
    <DepositAmount onComplete={handleShield} />
  );
};

export default Shield;
