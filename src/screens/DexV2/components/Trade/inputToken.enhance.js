import React from 'react';
import _ from 'lodash';

const withChangeInputToken = WrappedComp => (props) => {
  const { pairTokens } = props;

  const [inputToken, setInputToken] = React.useState(_.head(pairTokens));

  React.useEffect(() => {
    if (!_.isEmpty(pairTokens) && !inputToken) {
      setInputToken(pairTokens[0]);
    }
  }, [pairTokens]);

  return (
    <WrappedComp
      {...{
        ...props,
        inputToken,

        onChangeInputToken: setInputToken,
      }}
    />
  );
};

export default withChangeInputToken;
