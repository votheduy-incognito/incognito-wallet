class IncognitoCoinInfo {
  constructor(data = {}) {
    this.id = data?.ID;
    this.createdAt = data?.CreatedAt;
    this.updatedAt = data?.UpdatedAt;
    this.deletedAt = data?.DeletedAt;
    this.tokenID = data?.TokenID;
    this.image = data?.Image;
    this.isPrivacy = data?.IsPrivacy;
    this.name = data?.Name;
    this.symbol = data?.Symbol;
    this.userID = data?.UserID;
    this.ownerAddress = data?.OwnerAddress;
    this.description = data?.Description;
    this.showOwnerAddress = data?.ShowOwnerAddress;
  }
}

export default IncognitoCoinInfo;