import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@components/core';
import theme from '@src/styles/theme';
import { Row } from '@src/components';

const MainItem = ({ title, value }) => {
  return (
    <Row center spaceBetween style={theme.MARGIN.marginTopAvg}>
      <Text style={theme.text.mediumTextBold}>{`${title}`}</Text>
      <Text style={theme.text.mediumTextBold}>{`${value}`}</Text>
    </Row>
  );
};

MainItem.propTypes = {
  title: PropTypes.string,
  value: PropTypes.any,
};

MainItem.defautProps = {
  title: '',
  value: '',
};

export default MainItem;
