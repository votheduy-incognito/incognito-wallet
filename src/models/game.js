export class Token {
  constructor(json) {
    this.id = json.ID;
    this.symbol = json.Symbol ? json.Symbol.replace('w', '') : json.Symbol;
    this.name = json.Name;
    // this.price = json.Price;
    this.balance = json.Balance;
    this.address = json.Address;
    this.number = json.Number;
    this.description = json.Description;
    this.price = this.number > 0 ? this.balance / this.number : json.Price || 0;
    this.startPrice = json.Price;
  }

}

export class Cell {
  constructor(json) {
    this.name = json.Name;
    this.image = json.Image;
    this.token = json.Token.ID ? new Token(json.Token) : null;
    this.type = json.Type;
    this.index = json.Index;
  }
}

export class RollInfo {
  constructor(json) {
    this.cell = json.Cell ? new Cell(json.Cell) : null;
    this.diceNumber = json.DiceNumber || 0;
    this.dices = json.Dices || [];
    this.cellIndex = json.CellIndex || 0;
    this.rentFee = json.RentFee || 0;
    this.transactionId = json.TransactionID || '';
    this.jail = json.Jail;
    this.jailRoll = json.Jailroll || 0;
    this.airdrop = json.AirdropAmount || 0;
    this.atm = json.ATM || false;
    this.taxFee = json.TaxFee || 0;
  }
}

export class PlayerToken {
  constructor(json) {
    this.tokenId = json.TokenID;
    this.playerID = json.PlayerID;
    this.number = json.Number;
    this.name = json.Name;
    this.avatar = json.Avatar;
    this.token = json.Token ? new Token(json.Token) : null;
    this.createdAt = json.CreatedAt;
  }
}

export class Player {
  constructor(json) {
    this.id = json.ID;
    this.name = json.Name;
    this.color = json.Color;
    this.position = json.Position;
    this.creditor = json.Creditor;
    this.jail = json.Jail;
    this.jailRoll = json.Jailroll;
    this.communityChestJailCard = json.CommunityChestJailCard;
    this.chanceJailCard = json.ChangeJailCard;
    this.bidding = json.Bidding;
    this.tokens = (json.Tokens || []).map(token => new PlayerToken(token));
    this.jailRoll = json.Jailroll || 0;
    this.lapReward = json.LapReward || 0;
  }

}

export class Transaction {
  constructor(json) {
    this.id = json.ID;
    this.type = json.Type;
    this.player = new Player(json.Player || {});
    this.playerId = json.PlayerID;
    this.token = new Token(json.Token || {});
    this.tokenId = json.TokenID;
    this.number = json.Number;
    this.amount = json.Amount;
    this.status = json.Status;
    this.paymentTransactionId = json.PaymentTransactionID;
    this.note = json.Note || '';
  }
}

export const TransactionType = {
  RENT: 0,
  BUY: 1,
  SELL: 2,
  TAX: 3,
  Card: 4,
};

export class Card {
  constructor(json) {
    this.name = json.Name;
    this.action = json.Action;
    this.type = json.Type;
    this.newPosition = json.NewPosition;
    this.fee = json.Fee;
    this.cell = json.cell ? new Cell(json.cell) : null;
    this.rentFee = json.rentFee;
    this.transactionId = json.transactionId;
    this.note = json.Note;
    this.cardFee = json.CardFee || 0;
  }
}

export const NotificationStatus = {
  UNREAD: 0,
  READ: 1,
};

export const NotificationType = {
  INCOME: 0,
  OUTCOME: 1,
};

export class Notification {
  constructor(json) {
    this.id = json.ID;
    this.playerId = json.PlayerID;
    this.status = json.Status;
    this.message = json.Message;
    this.type = json.Type;
  }
}
