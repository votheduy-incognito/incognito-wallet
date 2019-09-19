import React from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import board from './board.png';
import {cellWidth, cellHeight, boardWidth, boardHeight, numberCells} from '../../constants';
import Cell from '../Cell';

function Board(props) {
  const { topPart, rightPart, bottomPart, leftPart, playerPosition } = props;
  const renderCell = (style, position, isMiddle, cell, index) => (
    <Cell
      key={cell.name}
      price={cell.token?.price || null}
      name={cell.name}
      style={[style, !isMiddle && (index === 0 || index === numberCells - 1) ? styles.cornerCell : {}]}
      text={index}
      position={position}
      playerPosition={playerPosition}
    />
  );

  return (
    <View style={styles.board}>
      <Image
        source={board}
        style={styles.boardImage}
        resizeMode="contain"
        resizeMethod="resize"
      />
      <View style={styles.boardTopPart}>
        {topPart.map(renderCell.bind(this, styles.topCell, 'top', false))}
      </View>
      <View style={styles.boardMiddlePart}>
        <View style={styles.boardLeftPart}>
          {leftPart.map(renderCell.bind(this, styles.leftCell, 'left', true))}
        </View>
        <View style={styles.boardRightPart}>
          {rightPart.map(renderCell.bind(this, styles.rightCell, 'right', true))}
        </View>
      </View>
      <View style={styles.boardBottomPart}>
        {bottomPart.map(renderCell.bind(this, styles.bottomCell, 'bottom', false))}
      </View>
    </View>
  );
}

const styles = {
  board: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  boardImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: boardWidth,
    height: boardHeight,
  },
  boardTopPart: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: cellHeight,
  },
  boardMiddlePart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: (boardHeight - cellHeight * 2),
    minHeight: (boardHeight  - cellHeight * 2),
    maxWidth: boardWidth,
    minWidth: boardWidth,
  },
  boardBottomPart: {
    flex: 1,
    flexDirection: 'row',
  },
  topCell: {
    maxHeight: cellHeight,
  },
  bottomCell: {
    maxHeight: cellHeight,
  },
  leftCell: {
    width: cellHeight,
    height: cellWidth,
  },
  rightCell: {
    width: cellHeight,
    height: cellWidth,
  },
  cornerCell: {
    width: cellHeight,
    height: cellHeight,
  },
};

Board.propTypes = {
  topPart: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  leftPart: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rightPart: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  bottomPart: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  playerPosition: PropTypes.number.isRequired,
};

export default React.memo(Board);
