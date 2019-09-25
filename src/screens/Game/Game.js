/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { TouchableOpacity, Text, ScrollView, RefreshControl } from '@src/components/core';
import Board from './components/Board';
import { homeStyle } from './style';
import {
  boardHeight,
  boardWidth,
  MESSAGES,
  PADDING
} from './constants';
import PriceDialog from './components/PriceDialog';
import SellDialog from './components/SellDialog';
import Dice from './components/Dice';
import Player from './components/Player';
import TopBar from './components/TopBar';
import {RollButton} from './components/Icons';
import CardDetail from './components/CardDetail';
import CellDetail from './components/CellDetail';
import JailDialog from './components/JailDialog';
import Loading from './components/Loading';
import ATMDialog from './components/ATMDialog';
import LoadingTx from './components/LoadingTx';
import NotificationDialog from './components/NotificationDialog';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topPart: [],
      bottomPart: [],
      rightPart: [],
      leftPart: [],
      isShowingPriceDialog: false,
      isShowingSellDialog: false,
      isShowingNotifications: false,
    };
  }

  componentDidMount() {
    this.splitCells();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cells !== this.props.cells) {
      this.splitCells();
    }
  }

  showPriceDialog = () => {
    this.setState({
      isShowingPriceDialog: true,
    });
  };

  showSellDialog = () => {
    this.setState({
      isShowingSellDialog: true,
    });
  };

  showNotificationsDialog = () => {
    this.setState({
      isShowingNotifications: true,
    });
  }

  hideDialog = () => {
    this.setState({
      isShowingPriceDialog: false,
      isShowingSellDialog: false,
      isShowingNotifications: false,
    });
  };

  splitCells() {
    const { cells } = this.props;
    const topPart = cells.slice(0, 11);
    const rightPart = cells.slice(11, 20);
    const bottomPart = cells.slice(20, 31).reverse();
    const leftPart = cells.slice(31, 40).reverse();

    this.setState({
      topPart,
      rightPart,
      bottomPart,
      leftPart,
    });
  }

  onBuy = () => {
    const { cells, player, onBuy } = this.props;
    const currentCell = player.position || 0;
    const cell = cells[currentCell];

    if (cell.token && cell.token.number > 0) {
      onBuy();
    }
  };

  render() {
    const {
      reload,
      dices,
      onMoveComplete,
      onBuy,
      onSell,
      onRoll,
      isLoading,
      isPaying,
      buyable,
      sellable,
      cells,
      account,
      player,
      card,
      onPayJailFine,
      isShowingATM,
      onCloseATM,
      notifications,
      rentFee,
    } = this.props;
    const {
      topPart,
      rightPart,
      bottomPart,
      leftPart,
      isShowingPriceDialog,
      isShowingSellDialog,
      isShowingNotifications,
    } = this.state;

    const currentCell = cells[player.position];

    return (
      <ScrollView
        style={homeStyle.container}
        refreshControl={(
          <RefreshControl
            refreshing={isLoading !== ''}
            onRefresh={reload}
          />
        )}
      >
        <View style={homeStyle.mainContainer}>
          <TopBar
            account={account}
            playerTokens={player.tokens}
            onSell={this.showSellDialog}
            onShowNotification={this.showNotificationsDialog}
          />
          <View style={styles.boardParts}>
            <Board
              topPart={topPart}
              bottomPart={bottomPart}
              rightPart={rightPart}
              leftPart={leftPart}
              playerPosition={player.position}
            />
            <Dice
              onRoll={onRoll}
              dices={dices}
            />
            <View style={styles.players}>
              <Player
                isReloading={isLoading === MESSAGES.RELOADING}
                position={player.position}
                id={player.id}
                onMoveComplete={onMoveComplete}
                player={player}
              />
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={this.showPriceDialog}
              style={[styles.button, styles.buyButton, !buyable ? styles.disabled : {}]}
              disabled={!buyable}
            >
              <Text style={styles.buttonText}>BUY</Text>
            </TouchableOpacity>
            <View>
              <RollButton
                onPress={onRoll}
                disabled={isLoading}
              />
            </View>
            <TouchableOpacity
              onPress={this.showSellDialog}
              style={[styles.button, styles.sellButton, !sellable ? styles.disabled : {}]}
              disabled={!sellable}
            >
              <Text style={styles.buttonText}>SELL</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CardDetail card={card} />
        <CellDetail
          cell={currentCell}
          playerTokens={player.tokens}
          rentFee={rentFee}
          onBuy={this.showPriceDialog}
          isLoading={isPaying || isLoading || isShowingATM || isShowingPriceDialog || isShowingSellDialog}
        />
        <PriceDialog
          visible={isShowingPriceDialog}
          onConfirmPrice={(...values) => {
            onBuy(...values);
            this.setState({ isShowingPriceDialog: false });
          }}
          onCancel={this.hideDialog}
          confirmText="Buy"
          cell={currentCell}
        />
        <SellDialog
          cells={cells}
          visible={isShowingSellDialog}
          playerTokens={player?.tokens}
          onConfirmPrice={(...values) => {
            onSell(...values);
            this.setState({ isShowingSellDialog: false });
          }}
          onCancel={this.hideDialog}
        />
        <JailDialog
          isInJail={player.jail}
          isPaying={isPaying}
          onPay={onPayJailFine}
          onRoll={onRoll}
          remaining={player.jailRoll}
        />
        <LoadingTx text={isPaying} />
        { isLoading ? <Loading text={isLoading} /> : null}
        <ATMDialog
          cells={cells}
          visible={isShowingATM}
          onConfirmPrice={(...values) => onBuy(...values)}
          player={player}
          onCancel={onCloseATM}
        />
        <NotificationDialog visible={isShowingNotifications} notifications={notifications} onCancel={this.hideDialog} />
      </ScrollView>
    );
  }
}

const styles = {
  boardParts: {
    position: 'relative',
    zIndex: 2,
    width: boardWidth,
    height: boardHeight,
    boxSizing: 'border-box',
    marginTop: 15,
    paddingLeft: PADDING / 2,
  },
  players: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  actions: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    width: 100,
    height: 32,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    margin: 15,
  },
  buyButton: {
    backgroundColor: '#25D694',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sellButton: {
    backgroundColor: '#014E52',
  },
  disabled: {
    backgroundColor: 'gray',
  }
};

Game.defaultProps = {
  isReloading: false
};

Game.propTypes = {
  reload: PropTypes.func.isRequired,
  isReloading: PropTypes.bool,
};

export default Game;
