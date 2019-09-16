import { Dimensions } from 'react-native';

export const PADDING = 10;
export const numberCells = 11;
const diff = numberCells + 4;

export const screenWidth = Math.round(Dimensions.get('window').width);
export const screenHeight = Math.round(Dimensions.get('window').height);
export const boardWidth = screenWidth - PADDING;
export const boardHeight = screenWidth - PADDING;
export const cellWidth = boardWidth / diff;
export const cellHeight = cellWidth / 0.33;
export const MOVE_TIME_PER_CELL = 50; //ms
export const SHAKE_THRESHOLD = 80000;
export const SUCCESS = 200;
export const TOTAL_CELLS = 40;
export const TOP_BAR_HEIGHT = 80;

export const GAME_HOST_PAYMENT_ADDRESS = '1Uv3xQbtbcoM1TV7GMWP86TRKk4uxnom7n4PMtJC2SN8t1X6TXSiECzEd2pXZg41zgYRGFNPiyqgy394dnb6i3QEhMhAyGDUaAoGpKwXu';
export const JAIL_POSITION = 10;
export const GO_TO_JAIL_POSITION = 30;
export const GO_POSITION = 0;
export const MAX_TOKEN = 700;
export const JAIL_FINE = 50; // PRV;
export const MAX_JAIL_ROLL = 3;
export const AUTO_CLOSE_POPUP_TIMEOUT = 3000;

// CHANCE && COMMUNITY_CHEST
export const CARD_ACTION = {
  MOVE: 0,
  PAY: 1,
  EARN: 2,
};

export const MAX_LAP_REWARD = 500;

export const MESSAGES = {
  DRAWING_CHANCE: 'Drawing a Chance card...',
  GETTING_CHEST: 'Opening the Community Chest...',
  ROLLING: 'Rolling...',
  MOVING: 'Moving...',
  RELOADING: 'Reloading...',
  WELCOME_MESSAGE: 'Welcome you to WHALES. 1000 PRV will be added to your balance in the next 5 minutes',
  GET_PLAYER: 'Getting your information...',
  AIRDROP: 'Nice. {prv} PRV has been airdropped to your wallet and will appear in the next 5 minutes.',
  OPEN_AIRDROP: 'Receiving airdrop...',
  OPEN_ATM: 'Opening the atm door',
  GET_PENDING_TRANSACTION: 'Welcome back. Catching you up...',
  PENDING_TRANSACTIONS: 'You owe someone something. Pay up before moving on',
  PAYING_RENT: 'Paying rent...',
  PAYING_TAX: 'Paying tax...',
  PAYING_CARD: 'Paying...',
  PAYING_JAIL: 'Paying 50 PRV to get out of jail...',
  COMPLETE_A_LAP_MESSAGE: 'You passed GO. 20 PRV will be added to your balance in the next 5 minutes',
  MAX_LAP_REWARD: 'You\'ve covered a great distance today. Your GO rewards will resume tomorrow',
};
