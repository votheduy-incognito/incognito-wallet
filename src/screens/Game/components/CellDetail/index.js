import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Button } from '@src/components/core';
import {MAX_TOKEN} from '../../constants';

const TIMEOUT = 1000;
const START_RATE = 11;

function calculateRentFee(token, playerTokens) {
  if (!token) {
    return 0;
  }
  let rentFee = 0;
  let playerTokenBought = 0;

  const tokenBought = MAX_TOKEN - token.number;

  playerTokens.forEach(playerToken => {
    if (playerToken.tokenId === token.id) {
      playerTokenBought = playerToken.number;
    }
  });

  if (tokenBought <= 0) {
    return 0;
  }

  if (tokenBought > 0) {
    rentFee = START_RATE* token.startPrice;
  }

  if (tokenBought >= 100) {
    rentFee = rentFee * 2;
  }

  if (tokenBought >= 200) {
    rentFee = rentFee * 4;
  }

  if (tokenBought >= 300) {
    rentFee = rentFee * 8;
  }

  if (tokenBought >= 400) {
    rentFee = rentFee * 12;
  }

  if (tokenBought >= 500) {
    rentFee = rentFee * 28;
  }

  if (tokenBought >= 600) {
    rentFee = rentFee * 34;
  }

  if (playerTokenBought > 0) {
    rentFee = rentFee - (rentFee * playerTokenBought) / tokenBought;
  }

  return rentFee;
}

function CellDetail(props) {
  const { cell, playerTokens, onBuy, isLoading } = props;
  const [currentCell, setCurrentCell] = React.useState(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (cell && !currentCell) {
      setCurrentCell(cell);
    } else if (currentCell?.name !== cell?.name && cell?.token && !isLoading) {
      setTimeout(() => {
        if (!isLoading) {
          setVisible(true);
          setCurrentCell(cell);
        }
      }, TIMEOUT);
    } else {
      setVisible(false);
    }
  }, [cell, isLoading]);

  const token = cell?.token;
  const rentFee = calculateRentFee(token, playerTokens);

  return (
    <Dialog visible={visible} style={styles.dialog}>
      {cell && cell.token ?
        <View>
          <DialogContent style={styles.content}>
            <Text style={[styles.tokenName, styles.center]}>
              {cell.name} ({token.symbol})
            </Text>
            <Text style={[styles.description]}>
              {cell.token.description}
            </Text>
            <Text style={[styles.description]}>
              You now also have the chance to buy {cell.name}.
            </Text>
            <Text>
              Available: {token.number || MAX_TOKEN}
            </Text>
            <Text>
              Sold: {MAX_TOKEN - (token.number || MAX_TOKEN)}
            </Text>
            <Text>
              Current market price: {token.price} PRV
            </Text>
            <Text style={styles.rentFee}>
              {rentFee ? `Your Rent Fee: ${rentFee}` : ''}
            </Text>
          </DialogContent>
          <View style={[styles.center, styles.actions]}>
            <Button
              onPress={onBuy}
              style={[styles.button, styles.center]}
              type="primary"
              title="Buy"
              titleStyle={styles.buttonText}
            />
            <Button
              onPress={() => setVisible(false)}
              style={[styles.button, styles.center]}
              type="secondary"
              title="Not now"
              titleStyle={styles.buttonText}
            />
          </View>
        </View> : null
      }
    </Dialog>
  );
}

const styles = StyleSheet.create({
  content: {
    width: 300,
    padding: 20,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  tokenName: {
    width: '100%',
    backgroundColor: '#FF4B47',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 5,
    marginBottom: 10,
  },
  description: {
    marginBottom: 20,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 30,
    maxHeight: 30,
    marginBottom: 20,
  },
  button: {
    width: 120,
    height: 32,
    margin: 10,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
  rentFee: {

  },
});

CellDetail.propTypes = {
  cell: PropTypes.shape({
    name: PropTypes.string,
    token: PropTypes.shape({
      number: PropTypes.number,
      symbol: PropTypes.string,
      price: PropTypes.number,
      description: PropTypes.string,
    }),
    index: PropTypes.number,
  }),
  playerTokens: PropTypes.arrayOf(PropTypes.shape({
    tokenId: PropTypes.string,
    number: PropTypes.string,
  })).isRequired,
  onBuy: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

CellDetail.defaultProps = {
  cell: null,
  isLoading: false,
};

export default React.memo(CellDetail);
