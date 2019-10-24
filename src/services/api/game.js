import http from '@src/services/http';
import { RollInfo, Transaction, Cell, Player, Card, Notification } from '@src/models/game';

const getBoardData = () =>
  http.post('game/get-board-data')
    .then(res => res.map(cell => new Cell(cell)));

const rollDice = (playerId) =>
  http.post('game/roll', {
    PlayerID: playerId
  }).then(res => new RollInfo(res));

const verifyTransaction = (transactionId, paymentTransactionId) =>
  http.post('game/verify', {
    TransactionID: transactionId,
    PaymentTransactionID: paymentTransactionId,
  }).then(res => new Transaction(res));

const getBuyPrice = (cellIndex, number) =>
  http.post('game/buy-price', {
    CellIndex: cellIndex,
    Number: number,
  });

const getSellPrice = (cellIndex, number) =>
  http.post('game/sell-price', {
    CellIndex: cellIndex,
    Number: number,
  });

const buyToken = (playerId, cellIndex, number, amount) =>
  http.post('game/buy', {
    PlayerID: playerId,
    CellIndex: cellIndex,
    Number: number,
    Amount: amount,
  }).then(transaction => new Transaction(transaction));

const sellToken = (playerId, cellIndex, number, amount) =>
  http.post('game/sell', {
    PlayerID: playerId,
    CellIndex: cellIndex,
    Number: number,
    Amount: amount,
  }).then(transaction => new Transaction(transaction));

const getPlayer = (playerId) =>
  http.post('game/player', {
    PlayerID: playerId,
  }).then(player => new Player(player));

const getPendingTransactions = (playerId) =>
  http.post('game/pending-transactions', {
    PlayerID: playerId,
  }).then(res => res.map(t => new Transaction(t)));

const cancelTransaction = (transactionId) =>
  http.post('game/cancel-transaction', {
    TransactionID: transactionId,
  });

const getCommunityChest = (playerId) =>
  http.post('game/card', {
    PlayerID: playerId,
    CardType: 0,
  }).then(res => new Card({
    ...res.Card,
    rentFee: res.RentFee,
    transactionId: res.TransactionID,
    cell: res.Cell,
  }));

const drawChanceCard = (playerId) =>
  http.post('game/card', {
    PlayerID: playerId,
    CardType: 1,
  }).then(res => new Card({
    ...res.Card,
    rentFee: res.RentFee,
    transactionId: res.TransactionID,
    cell: res.Cell,
  }));

const createPlayer = (playerId, shardId) =>
  http.post('game/new-player', {
    PlayerID: playerId,
    ShardID: shardId,
  }).then(player => new Player(player));

const payJailFine = (playerId, transactionId) =>
  http.post('game/jail-fine', {
    PlayerID: playerId,
    TransactionID: transactionId,
  });

const getPlayerNotifications = (playerId) =>
  http.post('game/player-notifications', {
    PlayerID: playerId,
  }).then(res => res.map(item => new Notification(item)));

export default {
  getBoardData,
  getBuyPrice,
  getSellPrice,
  verifyTransaction,
  rollDice,
  buyToken,
  sellToken,
  getPlayer,
  getPendingTransactions,
  cancelTransaction,
  createPlayer,
  getCommunityChest,
  drawChanceCard,
  payJailFine,
  getPlayerNotifications,
};
