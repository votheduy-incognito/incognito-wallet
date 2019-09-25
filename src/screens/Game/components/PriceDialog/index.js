import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Button } from '@src/components/core';

function calculatePrice(text, number, token) {
  if (token) {
    let price;
    if (text === 'Buy') {
      price = token.balance / Math.max(token.number - number, 1) * number;
    } else {
      price = token.price * number;
    }

    return price;
  }

  return 0;
}


function PriceDialog(props) {
  const { visible, onConfirmPrice, onCancel, cell, confirmText, remaining } = props;
  const [number, setNumber] = React.useState(1);
  const [isGettingPrice, setIsGettingPrice] = React.useState(false);
  const [isPaying, setIsPaying] = React.useState(false);
  const [totalPrice, setTotalPrice] = React.useState(calculatePrice(confirmText, 1, cell?.token));

  const onChangeNumber = async (text) => {
    const number = _.toInteger(text);
    getPrice(number);
  };
  const onConfirm = () => {
    if (!isGettingPrice && totalPrice > 0) {
      setIsPaying(true);
      onConfirmPrice(cell.index, number, totalPrice);
    }
  };
  const getPrice = number => {
    const token = cell.token;
    if (number <= 0 || number > token.number || (remaining > 0 && number > remaining)) {
      setTotalPrice(0);
      setNumber(0);
    } else {
      const price = calculatePrice(confirmText, number, cell.token);
      setTotalPrice(price);
      setNumber(number);
    }
  };

  React.useEffect(() => {
    setTotalPrice(calculatePrice(confirmText, 1, cell?.token));
    setNumber(1);
    setIsGettingPrice(false);
    setIsPaying(false);
  }, [visible]);

  const disabled = totalPrice <= 0 || number <= 0 || number > cell?.token?.number || isPaying;

  return (
    <Dialog visible={visible} style={styles.dialog}>
      <DialogContent style={styles.content}>
        { cell && cell.token ?
          <View>
            <Text style={[styles.tokenName, styles.center]}>
              {cell.name} ({cell.token.symbol})
            </Text>
            <Text>
              { confirmText === 'Buy' ? 'Available' : 'Balance'}: {remaining || cell.token.number}
            </Text>
            <Text>
              Current market price: {_.round(totalPrice, 4)}
            </Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10, paddingLeft: 5, paddingRight: 5}}
              onChangeText={onChangeNumber}
              defaultValue="1"
              keyboardType="number-pad"
            />
            <View style={[styles.actions, styles.center]}>
              <Button
                type="secondary"
                style={[styles.center, styles.button]}
                onPress={onCancel}
                title="Cancel"
                titleStyle={styles.buttonText}
              />
              <Button
                style={[styles.center, styles.button]}
                type="primary"
                disabled={disabled}
                onPress={onConfirm}
                title={confirmText}
                titleStyle={styles.buttonText}
              />
            </View>
          </View> : null
        }
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    width: 300,
    height: 245,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  tokenName: {
    width: 270,
    backgroundColor: '#FF4B47',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 5,
    marginBottom: 10,
  },
  content: {
    padding: 10,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 52,
    minHeight: 52,
    height: 62,
    marginTop: 5,
  },
  button: {
    width: 100,
    height: 32,
    margin: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});

PriceDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirmPrice: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  cell: PropTypes.shape({
    index: PropTypes.number,
    token: PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.number,
      symbol: PropTypes.string,
      balance: PropTypes.number,
      price: PropTypes.number,
    })
  }).isRequired,
  confirmText: PropTypes.string.isRequired,
  remaining: PropTypes.number,
};

PriceDialog.defaultProps = {
  remaining: null,
};

export default React.memo(PriceDialog);
