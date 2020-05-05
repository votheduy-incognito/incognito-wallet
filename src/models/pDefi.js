export class RewardModel {
  constructor(data = {}) {
    this.walletAddress = data.WalletAddress;
    this.amount1 = data.Amount1;
    this.amount2 = data.Amount2;
    this.total = data.TotalAmount;
    this.tokenId1 = data.Token1ID;
    this.tokenId2 = data.Token2ID;
    this.pair = data.Pair;
    this.beaconHeight = data.BeaconHeight;
    this.beaconTime = data.BeaconTimeStamp;
    this.interestRate1 = data.InterestRate1;
    this.interestRate2 = data.InterestRate2;
  }
}
