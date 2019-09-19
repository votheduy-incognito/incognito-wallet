import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { ScrollView } from '@src/components/core';
import PriceDialog from '../PriceDialog';
import {screenHeight, screenWidth} from '../../constants';
import Token from './Token';

function ATMDialog(props) {
  const { cells, visible, onConfirmPrice, onCancel } = props;
  const [cell, setCell] = React.useState({});
  const [isShowingPriceDialog, setIsShowingPriceDialog] = React.useState(false);
  const onSelectCell = (selectedCell) => {
    setCell(selectedCell);
    setIsShowingPriceDialog(true);
  };

  React.useEffect(() => {
    setIsShowingPriceDialog(false);
    setCell({});
  }, [visible]);

  return (
    <Dialog visible={visible} style={styles.dialog}>
      {cells ?
        <View>
          <DialogContent style={styles.content}>
            <View>
              <Text style={[styles.cellName, styles.center]}>
                ATM
              </Text>
              <Text style={[styles.description]}>
                Taste the rainbow. Buy any token here.
              </Text>
            </View>
            <ScrollView style={styles.scrollView}>
              {cells
                .filter(cell => cell.token && cell.token.id && cell.token.number)
                .map((cell) => (
                  <Token
                    key={cell.token.id}
                    cell={cell}
                    onSelect={onSelectCell}
                  />
                ))}
            </ScrollView>
          </DialogContent>
          <PriceDialog
            onCancel={() => setIsShowingPriceDialog(false)}
            onConfirmPrice={onConfirmPrice}
            cell={cell}
            visible={isShowingPriceDialog}
            confirmText="Buy"
          />
          <View style={[styles.center, styles.actions]}>
            <TouchableOpacity onPress={onCancel} style={[styles.center, styles.closeButton]}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View> : null
      }
    </Dialog>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 30,
    width: screenWidth,
    height: screenHeight - 80,
    backgroundColor: '#9AB7B8',
  },
  scrollView: {
    marginTop: 20,
    maxHeight: '80%',
  },
  closeButton: {
    width: 120,
    height: 32,
    backgroundColor: '#014E52',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    height: 80,
    padding: 30,
  },
  buttonText: {
    color: 'white'
  },
  cellName: {
    width: '100%',
    backgroundColor: '#FF4B47',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 5,
    marginBottom: 10,
  },
});

ATMDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirmPrice: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  cells: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number,
    token: PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.number,
      symbol: PropTypes.string,
    })
  })).isRequired,
};

export default React.memo(ATMDialog);
