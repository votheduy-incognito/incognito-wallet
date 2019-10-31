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

    let mainText;
    let subText;

    if (displayName === 'DApps') {
      mainText = 'pApps are coming soon.';
      subText = 'The first privacy-first applications built on Incognito. Watch this space.';
    } else {
      mainText = 'pDEX is coming soon.';
      subText = 'ETA: 5 November. Get ready to trade crypto privately.';
    }

    return (
      <View style={styles.imageWrapper}>
        <Image
          source={maintain}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{mainText}</Text>
        <Text style={styles.desc}>{subText}</Text>
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
    lineHeight: 20,
  },
};

Game.propTypes = {
  navigation: PropTypes.object,
};

export default Game;
