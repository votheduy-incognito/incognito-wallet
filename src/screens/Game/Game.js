import React from 'react';
import { View, Image } from 'react-native';
import maintain from './maintain.png';

class Game extends React.Component {
  render() {
    return (
      <View style={styles.full}>
        <Image
          source={maintain}
          style={styles.image}
          resizeMode="contain"
          resizeMethod="resize"
        />
      </View>
    );
  }
}

const styles = {
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
};

export default Game;
