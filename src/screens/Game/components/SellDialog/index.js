import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { ScrollView } from '@src/components/core';
import PriceDialog from '../PriceDialog';
import {screenHeight, screenWidth} from '../../constants';
import PlayerToken from '../PlayerToken';

function SellDialog(props) {
  const { cells, visible, onConfirmPrice, onCancel, playerTokens } = props;
  const [cell, setCell] = React.useState({});
  const [playerToken, setPlayerToken] = React.useState({});
  const [isShowingPriceDialog, setIsShowingPriceDialog] = React.useState(false);
  const onSelectPlayerToken = (playerToken) => {
    const selectedCell = cells.find(item => item.token?.id === playerToken.tokenId);
    setCell(selectedCell);
    setPlayerToken(playerToken);
    setIsShowingPriceDialog(true);
  };

  React.useEffect(() => {
    setIsShowingPriceDialog(false);
    setCell({});
    setPlayerToken({});
  }, [visible]);

  return (
    <Dialog visible={visible} style={styles.dialog}>
      {playerTokens && cells ?
        <View>
          <DialogContent style={styles.content}>
            <ScrollView style={styles.scrollView}>
              {playerTokens
                .filter(playerToken => playerToken.actualNumber > 0)
                .map((playerToken) => (
                  <PlayerToken
                    key={playerToken.tokenId}
                    playerToken={playerToken}
                    cells={cells}
                    onSelect={onSelectPlayerToken}
                  />
                ))}
            </ScrollView>
          </DialogContent>
          <PriceDialog
            onCancel={() => setIsShowingPriceDialog(false)}
            onConfirmPrice={onConfirmPrice}
            cell={cell}
            visible={isShowingPriceDialog}
            confirmText="Sell"
            remaining={Math.min(playerToken.number, playerToken.actualNumber)}
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
    maxHeight: '85%',
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
});

SellDialog.propTypes = {
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
  playerTokens: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired,
};

export default React.memo(SellDialog);
