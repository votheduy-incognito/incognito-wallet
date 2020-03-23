import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, View, ScrollView } from '@src/components/core';
import helloWorldImg from '@src/assets/images/papp/helloworld.png';
import PappItem from './PappItem';
import styles from './style';

const PAPPS = [
  {
    id: 1,
    name: 'Hello World',
    image: helloWorldImg,
    url: 'http://35.185.237.133/',
    title: 'Hello World',
    desc: 'This is a demonstration of a basic pApp'
  },
  // {
  //   id: 1,
  //   name: 'Get crypto rich',
  //   image: rollDiceImg,
  //   url: 'https://enigmatic-sea-09447.herokuapp.com/',
  //   title: 'Get crypto rich',
  //   desc: 'Predict the outcome,  shake the dice, win the crypto.'
  // }
];

class Papps extends PureComponent {
  constructor() {
    super();
  }

  render() {
    const { onGo } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
          <Container style={styles.content}>
            {
              PAPPS.map(({ id, image, desc, name, url, title }) => (
                <PappItem
                  style={styles.pappItem}
                  key={id}
                  image={image}
                  title={title}
                  desc={desc}
                  url={url}
                  name={name}
                  onPress={() => onGo({ id, image, desc, name, url, title })}
                />
              ))
            }
          </Container>
        </ScrollView>
      </View>
    );
  }
}

Papps.propTypes = {
  onGo: PropTypes.func.isRequired,
};

export default Papps;