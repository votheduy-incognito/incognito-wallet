class Papp {
  constructor(data = {}) {
    this.id = data?.ID;
    this.createdAt = data?.CreatedAt;
    this.updatedAt = data?.UpdatedAt;
    this.deletedAt = data?.DeletedAt;
    this.title = data?.Title;
    this.link = data?.Link;
    this.shortDescription = data?.ShortDescription;
    this.fullDescription = data?.FullDescription;
    this.logo = data?.Logo;
    this.image1 = data?.Image1;
    this.image2 = data?.Image2;
    this.image3 = data?.Image3;
    this.image4 = data?.Image4;
    this.image5 = data?.Image5;
    this.type = data?.Type;
    this.status = data?.Status;
    this.userID = data?.UserID;
    this.contactWebsite = data?.ContactWebsite;
    this.contactEmail = data?.ContactEmail;
    this.contactPhone = data?.ContactPhone;
    this.privacyPolicyUrl = data?.PrivacyPolicyUrl;
    this.notSubmitPrivacy = data?.NotSubmitPrivacy;
    this.unitName = data?.UnitName;
  }
}

export default Papp;