import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import Sound from 'react-native-sound';
import dice1 from '@src/assets/images/game/1.gif';
import dice2 from '@src/assets/images/game/2.gif';
import dice3 from '@src/assets/images/game/3.gif';
import dice4 from '@src/assets/images/game/4.gif';
import dice5 from '@src/assets/images/game/5.gif';
import dice6 from '@src/assets/images/game/6.gif';
import {cellHeight, MOVE_TIME_PER_CELL} from '../../constants';

const diceImages = {
  dice1,
  dice2,
  dice3,
  dice4,
  dice5,
  dice6,
};

class Dice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dices: [],
    };
  }

  componentDidMount() {
    this.sound = new Sound('game.mp3', Sound.MAIN_BUNDLE);
  }

  componentDidUpdate(prevProps) {
    const { dices: prevDices } = prevProps;
    const { dices } = this.props;

    if (prevDices !== dices && dices !== undefined && dices.length > 0) {
      this.roll();
    }
  }

  componentWillUnmount() {
    this.sound.release();
  }

  renderDice = (diceFace, index) => {
    return (
      <Image
        key={index}
        source={diceImages[`dice${diceFace}`]}
        resizeMode="cover"
        style={[styles.diceImage, {
          marginLeft: -(index * cellHeight),
        }]}
      />
    );
  };

  roll = () => {
    this.setState({ dices: [] });
    setTimeout(this.rollDice, MOVE_TIME_PER_CELL);
  };

  rollDice = () => {
    const { numberOfDice, dices: diceFaces } = this.props;
    const dices = [];
    this.sound.play();

    for (let i = 0; i < numberOfDice; i++) {
      const diceFace = diceFaces[i];
      const dice = this.renderDice(diceFace, i);
      dices.push(dice);
    }

    this.setState({
      dices
    });
  };

  render() {
    const { dices } = this.state;
    const { dices: dicesNumber } = this.props;

    if (!dicesNumber || dicesNumber.length === 0) {
      return null;
    }

    return (
      <View style={styles.diceWrapper}>
        <View style={styles.dice}>
          {dices}
        </View>
      </View>
    );
  }
}

const styles = {
  diceWrapper: {
    position: 'absolute',
    top: cellHeight,
    left: cellHeight,
    right: cellHeight,
    bottom: cellHeight,
  },
  dice: {
    position: 'absolute',
    left: cellHeight / 2,
    bottom: cellHeight * 1.25,
    flex: 1,
    flexDirection: 'row',
  },
  diceImage: {
    width: cellHeight * 1.5,
    height: cellHeight * 1.5,
  }
};

Dice.propTypes = {
  numberOfDice: PropTypes.number,
  noSound: PropTypes.bool,
  dices: PropTypes.arrayOf(PropTypes.number),
};

Dice.defaultProps = {
  numberOfDice: 2,
  noSound: false,
  dices: undefined,
};

export default React.memo(Dice);
