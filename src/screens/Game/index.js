import React from 'react';
import PropTypes from 'prop-types';
import {View, Image, Text} from 'react-native';
import {FontStyle} from '@src/styles/TextStyle';
import {COLORS} from '@src/styles';
import maintain from '@src/assets/images/coming_soon.png';

class Game extends React.Component {
  render() {
    const { navigation} = this.props;
    let displayName = navigation.state.key;

    if (displayName === 'DApps') {
      displayName = 'Dapps';
    } else {
      displayName = 'DEX';
    }

    return (
      <View style={styles.imageWrapper}>
        <Image
          source={maintain}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{displayName} is coming soon.</Text>
        <Text style={styles.desc}>This feature is being developed.</Text>
        <Text style={styles.desc}>Stay tuned!</Text>
      </View>
    );
  }
}

const styles = {
  imageWrapper: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
  },
  title: {
    ...FontStyle.medium,
    marginTop: 30,
    fontSize: 26,
    color: COLORS.dark1,
    textAlign: 'center',
    marginBottom: 7,
  },
  desc: {
    marginTop: 5,
    color: '#657576',
    textAlign: 'center',
  },
};

Game.propTypes = {
  navigation: PropTypes.object,
};

export default Game;
