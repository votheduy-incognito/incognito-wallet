import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { cellWidth, cellHeight } from '../../constants';

function Cell(props) {
  const { style, price, position, name } = props;
  let contentStyle = {};

  if (position === 'top') {
    contentStyle.justifyContent = 'flex-start';
  } else if (position === 'left') {
    contentStyle.transform = [{ rotate: '90deg'}];
    contentStyle.marginRight = 35;
  } else if (position === 'right') {
    contentStyle.transform = [{ rotate: '-90deg'}];
    contentStyle.marginLeft = 35;
  } else {
    contentStyle.justifyContent = 'flex-end';
  }

  return (
    <View style={[styles.cell, style]}>
      <View style={[styles.content, contentStyle]}>
        <Text style={styles.name}>
          {/*{name}*/}
        </Text>
        <Text style={styles.price}>
          {price ? _.round(price, 2) : price}
        </Text>
      </View>
    </View>
  );
}

Cell.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
};

Cell.defaultProps = {
  name: null,
  price: null,
};

const styles = {
  cell: {
    width: cellWidth,
    height: cellHeight,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  price: {
    color: 'black',
    fontSize: 8,
    textAlign: 'center',
  },
  name: {
    color: 'black',
    fontSize: 7,
    textAlign: 'center',
  },
};

export default React.memo(Cell);
