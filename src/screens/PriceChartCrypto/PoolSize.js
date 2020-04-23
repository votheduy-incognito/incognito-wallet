import React from 'react';
import PropTypes from 'prop-types';
import DashboardItem from '@components/DashboardItem';
import formatUtil from '@utils/format';

const PoolSize = ({ pair }) => {
  const { tokenSymbol1, tokenSymbol2 } = pair;
  let { tokenPool1, tokenPool2 } = pair;
  tokenPool1 = formatUtil.formatWithNotation(tokenPool1);
  tokenPool2 = formatUtil.formatWithNotation(tokenPool2);
  const text = `${tokenPool1} ${tokenSymbol1} - ${tokenPool2} ${tokenSymbol2}`;
  return (
    <DashboardItem title="Pool size" text={text} />
  );
};

PoolSize.propTypes = {
  pair: PropTypes.object.isRequired,
};

export default React.memo(PoolSize);
