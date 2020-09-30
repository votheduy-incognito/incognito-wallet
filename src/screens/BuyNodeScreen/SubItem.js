import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@components/core';
import _ from 'lodash';
import theme from '@src/styles/theme';

const SubItem = ({ description, marginTop }) => {
  return (
    <Text style={[theme.MARGIN.marginTopDefault, theme.text.regularSizeMediumFontGrey, _.isNumber(marginTop) && { marginTop }]}>{`${description}`}</Text>
  );
};

SubItem.propTypes = {
  description: PropTypes.string.isRequired,
  marginTop: PropTypes.number,
};

SubItem.defaultProps = {
  marginTop: undefined
};

export default SubItem;
