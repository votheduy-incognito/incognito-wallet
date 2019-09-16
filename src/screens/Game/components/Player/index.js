import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View } from 'react-native';
import { Toast } from '@src/components/core';
import {
  cellWidth,
  cellHeight,
  boardHeight,
  boardWidth,
  TOTAL_CELLS,
  MOVE_TIME_PER_CELL,
  MESSAGES,
  GO_POSITION,
  MAX_LAP_REWARD
} from '../../constants';
import { Unicorn } from '../Icons';

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('done');
    }, ms);
  });
}

function Player(props) {
  const { onMoveComplete, position, id, isReloading, player } = props;
  const [currentPlayer, setCurrentPlayer] = React.useState(id);
  const [cell, setCell] = React.useState(position);

  React.useEffect( () => {
    let isCompletedALap = false;

    async function moveForward() {
      for (let nextCell = cell; nextCell !== position; nextCell = (nextCell + 1) % TOTAL_CELLS) {
        setCell(nextCell);
        await sleep(MOVE_TIME_PER_CELL);
      }

      setCell(position);



      if (isCompletedALap) {
        if (player.lapReward >= MAX_LAP_REWARD) {
          Toast.showInfo(MESSAGES.MAX_LAP_REWARD, { duration: 10000 });
        } else {
          Toast.showInfo(MESSAGES.COMPLETE_A_LAP_MESSAGE, { duration: 10000 });
          player.lapReward += 200;
        }
      }

      onMoveComplete();
    }

    async function moveBack() {
      for (let nextCell = cell; nextCell !== position; nextCell = (nextCell - 1 + TOTAL_CELLS) % TOTAL_CELLS) {
        setCell(nextCell);
        await sleep(MOVE_TIME_PER_CELL);
      }

      setCell(position);

      onMoveComplete();
    }

    if (!isReloading && !player.jail && position !== cell) {
      const lastPosition = cell;
      isCompletedALap = (lastPosition > GO_POSITION && position >= GO_POSITION && position < lastPosition) ||
          (lastPosition < GO_POSITION && (position >= GO_POSITION || position < lastPosition));
    }


    if (cell !== position && id === currentPlayer) {

      if (position - cell === 37 || cell - position === 3) {
        moveBack();
      } else {
        moveForward();
      }
    }

    if (id !== currentPlayer && _.isInteger(position)) {
      setCurrentPlayer(id);
      setCell(position);
    }
  }, [position, id]);

  let top = 0;
  let left = 0;
  if (cell <= 10) {
    top = 20;
    left = cell * cellWidth;

    if (cell > 0) {
      left += (cellHeight - cellWidth);
    }

    if (cell === 0 || cell === 10) {
      left += (cellHeight - cellWidth) / 2;
    }

  } else if (cell < 20) {
    left = boardWidth - cellWidth - cellWidth;
    top = (cell - 11) * cellWidth + cellHeight;
  } else if (cell <= 30) {
    const numberCell = (30 - cell);
    left = numberCell * cellWidth;
    top = boardHeight - cellHeight / 1.5;

    if (numberCell > 0) {
      left += (cellHeight - cellWidth);
    }

    if (numberCell === 0 || numberCell === 10) {
      left += (cellHeight - cellWidth) / 2;
    }
  } else {
    left = cellWidth;
    top = (39 - cell) * cellWidth + cellHeight;
  }

  const style = {
    top,
    left,
  };
  return (
    <View style={[{
      position: 'absolute',
      width: cellWidth,
      height: cellWidth,
      top: 0,
      left: 0,
    }, style]}
    >
      <Unicorn size="small" />
    </View>
  );
}

Player.propTypes = {
  id: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  onMoveComplete: PropTypes.func.isRequired,
  isReloading: PropTypes.bool,
  player: PropTypes.shape({
    jail: PropTypes.bool,
    lapReward: PropTypes.number,
  }),
};

Player.defaultProps = {
  isReloading: false,
  player: {},
};

export default React.memo(Player);
