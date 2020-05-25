import React from 'react';

const withPair = WrappedComp => (props) => {
  const [pair, setPair] = React.useState([]);
  const { inputToken, outputToken, pairs } = props;

  React.useEffect(() => {
    if (inputToken && outputToken) {
      const pair = pairs.find(item =>
        item.keys.includes(inputToken.id) &&
        item.keys.includes(outputToken.id)
      );
      setPair(pair);
    } else {
      setPair(null);
    }
  }, [inputToken, outputToken, pairs]);

  return (
    <WrappedComp
      {...{
        ...props,
        pair,
      }}
    />
  );
};

export default withPair;
