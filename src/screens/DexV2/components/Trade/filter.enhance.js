import React from 'react';
import _ from 'lodash';
import { COINS } from '@src/constants';

const withFilter = WrappedComp => (props) => {
  const [outputToken, setOutputToken] = React.useState(null);
  const [outputList, setOutputList] = React.useState([]);
  const { inputToken, pairs, pairTokens } = props;
  const filter = () => {
    try {
      let newOutputToken = outputToken;
      let outputList = [];

      if (pairs.find(pair => pair.keys.includes(inputToken.id))) {
        outputList = pairs
          .map(pair => {
            const {keys} = pair;

            if (inputToken.id === COINS.PRV_ID ||!keys.includes(inputToken.id)) {
              const id = pair.keys.find(key => key !== COINS.PRV_ID);
              return pairTokens.find(token => token.id === id);
            }

            return null;
          })
          .filter(item => item && item.name && item.symbol);

        const prvToken = pairTokens.find(token => token.id === COINS.PRV_ID);
        if (inputToken.id !== COINS.PRV_ID && !outputList.includes(prvToken)) {
          outputList.push(prvToken);
        }
      }

      if (inputToken.address) {
        outputList = outputList.concat(pairTokens.filter(token => token.address && token.id !== inputToken.id));
      }

      outputList = _(outputList)
        .orderBy([
          'priority',
          'hasIcon',
          item => item.symbol && item.symbol.toLowerCase(),
        ], ['asc', 'desc', 'desc', 'asc'])
        .uniqBy(item => item.id)
        .value();

      if (outputToken && !outputList.find(item => item.id === outputToken.id)) {
        newOutputToken = null;
      }

      newOutputToken = newOutputToken || outputList[0];
      setOutputToken(newOutputToken);
      setOutputList(outputList);
    } catch (error) {
      console.debug('FILTER OUTPUT LIST', error);
    }
  };

  React.useEffect(() => {
    if (inputToken) {
      filter();
    }
  }, [inputToken, pairs]);

  return (
    <WrappedComp
      {...{
        ...props,
        onChangeOutputToken: setOutputToken,
        outputList,
        outputToken,
      }}
    />
  );
};

export default withFilter;
