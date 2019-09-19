/* eslint-disable */
import { Toast } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import { Cell, NotificationStatus, Player, TransactionType } from '@src/models/game';
import { getBalance as getAccountBalance, reloadAccountFollowingToken } from '@src/redux/actions/account';
import { reloadAccountList } from '@src/redux/actions/wallet';
import { accountSeleclor } from '@src/redux/selectors';
import gameAPI from '@src/services/api/game';
import accountService from '@src/services/wallet/accountService';
import firebase from 'firebase';
import 'firebase/database';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import LoadingContainer from '../../components/LoadingContainer';
import { AUTO_CLOSE_POPUP_TIMEOUT, CARD_ACTION, GAME_HOST_PAYMENT_ADDRESS, GO_TO_JAIL_POSITION, JAIL_FINE, JAIL_POSITION, MAX_JAIL_ROLL, MESSAGES } from './constants';
import Game from './Game';

const isEmulator = DeviceInfo.isEmulator();

let accelerometer;

if (!isEmulator) {
  // accelerometer = require('react-native-sensors').accelerometer;
}

const originalFee = 0;
const TIMEOUT = 2000;
const SHORT_TIMEOUT = 1000;
const LONG_DURATION = 7000;

class GameContainer extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: '',
      cells: [],
      isShowingWelcome: false,
      isShowingATM: false,
      notifications: [],
    };
    this.lastAcceleration = {};
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.account?.name !== prevProps.account?.name) {
  //     this.getPlayer(this.state.cells);
  //   }
  // }

  componentDidMount() {
    this.getData();
  }

  getData = async() => {
    const { navigation } = this.props;
    this.getFirebaseData();

    navigation.addListener(
      'willBlur',
      () => {
        this.setState({ rollInfo: {}, isShowingATM: false });
      }
    );

    navigation.addListener(
      'willFocus',
      () => {
        this.getPlayer();
      }
    );

    // if (accelerometer) {
    //   accelerometer.subscribe(({x, y, z, timestamp}) => {
    //     const {x: lastX = x, y: lastY = y, z: lastZ = z} = this.lastAcceleration;
    //     const diffTime = timestamp - this.lastTimestamp;
    //     const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
    //
    //     if (speed > SHAKE_THRESHOLD && diffTime > 0) {
    //       const isFocused = this.props.navigation.isFocused();
    //       if (isFocused) {
    //         this.onRoll();
    //       }
    //     }
    //
    //     this.lastTimestamp = timestamp;
    //     this.lastAcceleration = {
    //       x,
    //       y,
    //       z,
    //     };
    //   });
    // }
  };

  async getPlayerNotifications() {
    const { account } = this.props;
    try {
      const notifications = await gameAPI.getPlayerNotifications(account.PaymentAddress);
      const lastNotification = _.last(notifications);

      if (lastNotification && lastNotification.status === NotificationStatus.UNREAD) {
        Toast.showInfo(lastNotification.message, {duration: LONG_DURATION})
      }
      this.setState({ notifications: _.orderBy(notifications, 'id', 'desc') });
    } catch (error) {
      console.log('Notification error', error);
    }
  }

  reload = async () => {
    const { isLoading } = this.state;
    if (!isLoading) {
      this.setState({ isLoading: MESSAGES.RELOADING, rollInfo: {} });
      try {
        const promises = [this.getPlayer(), this.getPendingTransactions()];
        await Promise.all(promises);
      } catch (error) {
        console.log('Reload Error', error);
      }
      this.setState({
        isLoading: '',
      });
    }
  };

  async getFirebaseData() {
    const config = {
      databaseURL: 'https://aos-brain-inc-game.firebaseio.com/',
    };

    firebase.initializeApp(config);
    const database = new firebase.database();
    const boardRef = database.ref('/board/');

    const value = await boardRef.once('value');
    this.setState({
      cells: _.map(value.toJSON(), value => new Cell(value)),
    });

    boardRef.on('value', value => {
      this.setState({
        cells: _.map(value.toJSON(), value => new Cell(value)),
      });
    });

    const playersRef = database.ref('/players/');
    playersRef.on('value', value => {
      this.setState({
        players: _.map(value.toJSON(), value => new Player(value)),
      });
    });

    this.reload();
  }

  async getPlayer() {
    const {account, wallet, getAccountBalance} = this.props;
    const prevLoading = this.state.isLoading;

    try {
      this.setState({isLoading: MESSAGES.GET_PLAYER});

      let player;
      try {
        player = await gameAPI.getPlayer(account.PaymentAddress);
      } catch (error) {
        const bytes = account.PublicKeyBytes.split(',');
        const lastByte = _.toInteger(_.last(bytes));
        const shard = lastByte % 8;

        player = await gameAPI.createPlayer(account.PaymentAddress, shard);
        Toast.showInfo(MESSAGES.WELCOME_MESSAGE, {duration: LONG_DURATION})
      }

      this.setState({
        player,
      });

      await getAccountBalance(account);
      await this.getPlayerNotifications();
      const accountWallet = wallet.getAccountByName(account?.name);

      player.tokens.forEach(playerToken => {
        const newPlayerToken = playerToken;
        accountWallet.getPrivacyCustomTokenBalance(playerToken.tokenId)
          .then(actualNumber => {
            newPlayerToken.actualNumber = actualNumber;
          });
      });

      this.setState({
        player,
      });

      if (!prevLoading) {
        this.setState({isLoading: ''});
      }
      return player;
    } catch (error) {
      this.setState({isLoading: ''});
      return {};
    }
  }

  async getPendingTransactions() {
    const {account} = this.props;
    const {cells} = this.state;

    const pendingTransactions = await gameAPI.getPendingTransactions(account.PaymentAddress);

    for (let i = 0; i < pendingTransactions.length; i++) {
      const { type, id, amount, tokenId, note } = pendingTransactions[i];

      if (type === TransactionType.RENT) {
        const cell = cells.find(item => item.token?.id === tokenId);
        this.setState({ isLoading: MESSAGES.PAYING_RENT });
        await this.payRentFee(GAME_HOST_PAYMENT_ADDRESS, amount, id);
      } else if (type === TransactionType.TAX) {
        this.setState({ isLoading: MESSAGES.PAYING_TAX });
        await this.payTax(amount, id);
      } else if (type === TransactionType.Card) {
        this.setState({ isLoading: MESSAGES.PAYING_CARD });
        await this.payPRV(GAME_HOST_PAYMENT_ADDRESS, amount, `for ${note}`, id);
      }
    }
  }

  async payRentFee(address, fee, transactionId) {
    const { account, wallet } = this.props;
    const paymentInfos = [{
      paymentAddressStr: address, amount: fee * 1e9
    }];

    try {
      this.setState({ isPaying: `Paying ${_.round(fee, 2)} PRV for rent...` });
      const res = await accountService.sendGameConstant(paymentInfos, originalFee, true, account, wallet, transactionId);
      const transaction = await gameAPI.verifyTransaction(transactionId, res.TxID);
      console.log('Transaction', transaction);
      Toast.showSuccess(`You paid ${fee} PRV for rent`);
    } catch (error) {
      Toast.showError(error.message);
    }

    this.setState({ isPaying: '' });
  }

  async payPRV(address, fee, info, transactionId) {
    const { account, wallet } = this.props;
    const paymentInfos = [{
      paymentAddressStr: address, amount: fee * 1e9
    }];

    let res;
    console.log('Pay PRV', info, transactionId);

    try {
      this.setState({ isPaying: `Paying ${_.round(fee, 2)} PRV ${info}...` });
      res = await accountService.sendGameConstant(paymentInfos, originalFee, true, account, wallet, transactionId);

      if (transactionId) {
        const transaction = await gameAPI.verifyTransaction(transactionId, res.TxID);
        console.log('Transaction', transaction);
      }

      Toast.showSuccess(`${_.round(fee, 2)} PRV will be deducted in the next 5 minutes`);
    } catch (error) {
      Toast.showError(error.message);
    }

    this.setState({ isPaying: '' });

    return res;
  }

  goToJail() {
    const { player } = this.state;
    const newPlayer = { ...player };
    newPlayer.position = JAIL_POSITION;
    newPlayer.jailRoll = MAX_JAIL_ROLL;
    newPlayer.jail = true;

    this.setState({ player: newPlayer });
  }

  async handleCard() {
    const { player, rollInfo } = this.state;
    const newPlayer = {...player};
    const cellName = rollInfo.cell.name.toLowerCase();
    let card;
    if (cellName === 'chance') {
      this.setState({ isLoading: MESSAGES.DRAWING_CHANCE });
      card = await gameAPI.drawChanceCard(player.id);
    } else {
      this.setState({ isLoading: MESSAGES.GETTING_CHEST });
      card = await gameAPI.getCommunityChest(player.id);
    }

    console.log('card', card);
    this.setState({ card, isLoading: '' });
    if (card.action === CARD_ACTION.PAY) {
      const fee = card.fee;
      setTimeout(async () => {
        const cardInfo = card.note;
        await this.payPRV(GAME_HOST_PAYMENT_ADDRESS, fee, `for ${cardInfo}`, card.transactionId);
        this.setState({ player: newPlayer, isLoading: '' });
      }, AUTO_CLOSE_POPUP_TIMEOUT);
    }

    if (card.action === CARD_ACTION.MOVE) {
      const newPosition = card.newPosition;
      setTimeout(() => {
        newPlayer.position = newPosition;

        if (player.position === JAIL_POSITION) {
          this.goToJail();
        }

        this.setState({ player: newPlayer, isLoading: MESSAGES.MOVING, rollInfo: {} });
      }, AUTO_CLOSE_POPUP_TIMEOUT);
    }

    if (card.action === CARD_ACTION.EARN) {
      const fee = card.fee;
      setTimeout(async () => {
        Toast.showInfo(`${fee} PRV will be added in the next 5 minutes`);
      }, AUTO_CLOSE_POPUP_TIMEOUT);
    }
  }

  async handleSpecialCell() {
    const { rollInfo } = this.state;
    const cellName = rollInfo.cell.name.toLowerCase();
    if (cellName === 'chance' || cellName === 'community chest') {
      this.handleCard()
    } else {
      this.setState({ isLoading: '' });
    }
  }

  async payTax(fee, transactionId) {
    await this.payPRV(
      GAME_HOST_PAYMENT_ADDRESS,
      fee,
      fee === 20 ? 'for income tax' : 'for super tax',
      transactionId,
    );
  }

  onCloseATM = () => {
    this.setState({ isShowingATM: false });
  };

  onRoll = async () => {
    const { player, isLoading, isPaying } = this.state;
    if (!isLoading && !isPaying) {
      this.setState({isLoading: MESSAGES.ROLLING, card: null});
      try {
        const data = await gameAPI.rollDice(player.id);
        const playerNewData = { ...player };

        if (data.dices.length === 2 && data.dices[0] === data.dices[1]) {
          playerNewData.jail = false;
          playerNewData.jailRoll = 0;
        }

        if (data.jail) {
          if (data.cellIndex === GO_TO_JAIL_POSITION) {
            playerNewData.position = data.cellIndex;
          } else {
            playerNewData.jailRoll = data.jailRoll;
            this.setState({
              isLoading: '',
            });
          }
        } else {
          playerNewData.position = data.cellIndex;
        }

        this.setState({
          rollInfo: data,
        });

        if (!player.jail) {
          setTimeout(() => {
            this.setState({player: playerNewData, isLoading: MESSAGES.MOVING});
          }, TIMEOUT)
        } else {
          this.setState({player: playerNewData, isLoading: ''});
        }
      } catch (error) {
        console.log('Roll Error', error.message);
        if (error.message === 'Player has pending transactions.') {
          Toast.showInfo(MESSAGES.PENDING_TRANSACTIONS, { duration: LONG_DURATION });
          this.setState({ isLoading: MESSAGES.GET_PENDING_TRANSACTION });
          await this.getPendingTransactions();
        }
        this.setState({isLoading: ''});
      }
    }
  };

  onMoveComplete = async () => {
    const { rollInfo, card } = this.state;

    if (card) {
      if (card.rentFee && card.transactionId) {
        await this.payRentFee(GAME_HOST_PAYMENT_ADDRESS, card.rentFee, card.transactionId);
      } else if (card.cardFee && card.transactionId) {
        await this.payPRV(GAME_HOST_PAYMENT_ADDRESS, card.cardFee, `for ${card.note}`, card.transactionId);
      }

      return this.setState({ card : null, isLoading: '' });
    }

    if (!_.isEmpty(rollInfo)) {

      if (rollInfo.jail) {
        setTimeout(() => {
          this.goToJail();
          rollInfo.jail = false;
          return this.setState({ loading: '', rollInfo });
        }, TIMEOUT);
      } else if (rollInfo.rentFee && rollInfo.transactionId) {
        await this.payRentFee(GAME_HOST_PAYMENT_ADDRESS, rollInfo.rentFee, rollInfo.transactionId);
        this.setState({isLoading: ''});
      } else if (rollInfo.taxFee && rollInfo.transactionId) {
        await this.payTax(rollInfo.taxFee, rollInfo.transactionId);
        this.setState({isLoading: ''});
      } else if (rollInfo.airdrop) {
        this.setState({ isLoading: MESSAGES.OPEN_AIRDROP });
        setTimeout(() => {
          Toast.showInfo(MESSAGES.AIRDROP.replace(/{prv}/g, rollInfo.airdrop), { duration: LONG_DURATION });
          this.setState({isLoading: ''});
        }, TIMEOUT);
      } else if (rollInfo.atm) {
        this.setState({ isLoading: '', isShowingATM: true });
      } else if (!rollInfo.cell?.token) {
        this.handleSpecialCell();
      } else {
        this.setState({isLoading: ''});
      }

    } else {
      this.setState({isLoading: ''});
    }
  };

  onBuy = async (cellIndex, number, price) => {
    const { player, cells } = this.state;
    const { account, wallet } = this.props;
    const { token } = cells[cellIndex];

    let buyTransaction;

    try {
      this.setState({ isPaying: `You're buying ${number} ${token.symbol}...` });
      buyTransaction = await gameAPI.buyToken(player.id, cellIndex, number, price);
      const paymentInfos = [{
        paymentAddressStr: GAME_HOST_PAYMENT_ADDRESS, amount: price * 1e9
      }];
      console.log('SendConstant', paymentInfos, originalFee, account, buyTransaction.id);
      const res = await accountService.sendGameConstant(paymentInfos, originalFee, true, account, wallet, buyTransaction.id);
      await gameAPI.verifyTransaction(buyTransaction.id, res.TxID);
      await this.getPlayer();
      Toast.showSuccess(`You bought ${number} ${token.symbol}!`);
    } catch (error) {
      if (buyTransaction) {
        await gameAPI.cancelTransaction(buyTransaction.id);
      }

      console.log('SendConstant error', error);
      Toast.showError(error.message);
    }
    this.setState({ isPaying: '', isShowingATM: false });
  };

  onSell = async (cellIndex, number, price) => {
    const { player, cells } = this.state;
    const { account, wallet } = this.props;
    const token = cells[cellIndex].token;

    let sellTransaction;

    try {
      this.setState({ isPaying: `You're selling ${number} ${token.symbol}...` });
      sellTransaction = await gameAPI.sellToken(player.id, cellIndex, number, price);
      const tokenObject = {
        TokenID: token.id,
        TokenName: token.name,
        TokenSymbol: token.symbol,
        TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND,
        TokenAmount: number,
        TokenFee: originalFee,
        TokenReceivers: {
          [GAME_HOST_PAYMENT_ADDRESS]: number,
        }
      };

      const res = await accountService.sendGameToken(tokenObject, account, sellTransaction.id);
      await gameAPI.verifyTransaction(sellTransaction.id, res.TxID);
      await this.getPlayer();
      console.log('Send token success', res);
      Toast.showSuccess(`You have put ${number} ${token.symbol} up for sale. Your balance will update when the order is filled`, { duration: LONG_DURATION });
    } catch(error) {
      console.log('Send token error', error);
      Toast.showError(error.message || error.Message);
    }

    this.setState({ isPaying: '' });
  };

  onPayJailFine  = async() => {
    const { player } = this.state;
    try {
      const transaction = await this.payPRV(GAME_HOST_PAYMENT_ADDRESS, JAIL_FINE, MESSAGES.PAYING_JAIL);
      player.jail = false;
      player.jailRoll = 0;
      this.setState({ isLoading: MESSAGES.PAYING_JAIL, player });
      console.log('Pay jail fine', transaction);
      await gameAPI.payJailFine(player.id, transaction.TxID);
    } catch(error) {
      console.log('Pay jail fine error', error);
    } finally {
      this.setState({ isLoading: '', isPaying: '' });
    }
  };

  render() {
    const { isLoading, cells, rollInfo, isPaying, player, isShowingWelcome, card, isShowingATM, notifications } = this.state;
    const { account } = this.props;

    if (!account || !cells || cells.length === 0 || !player) {
      return <LoadingContainer />;
    }

    const buyable = cells[player.position].token?.number > 0 && !(isLoading || isPaying);
    const sellable = !(isLoading || isPaying) && player?.tokens?.some(token => token.number > 0);

    return (
      <Game
        reload={this.reload}
        onBuy={this.onBuy}
        onSell={this.onSell}
        onRoll={this.onRoll}
        cells={cells}
        isLoading={isLoading}
        dices={rollInfo?.dices || []}
        onMoveComplete={this.onMoveComplete}
        isPaying={isPaying}
        buyable={buyable}
        sellable={sellable}
        account={account}
        player={player}
        isShowingWelcome={isShowingWelcome}
        onPayJailFine={this.onPayJailFine}
        card={card}
        isShowingATM={isShowingATM}
        onCloseATM={this.onCloseATM}
        notifications={notifications}
      />
    );
  }
}

const mapDispatch = { getAccountBalance, reloadAccountFollowingToken, reloadAccountList };

const mapStateToProps = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
});

GameContainer.propTypes = {
  account: PropTypes.shape({}).isRequired,
  wallet: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps, mapDispatch)(GameContainer);
