class User {
  static parseSubscribeEmailData(data = {}) {
    return {
      id: data.ID,
      createdAt: data.CreatedAt,
      updatedAt: data.UpdatedAt,
      deletedAt: data.DeletedAt,
      user: data.User,
      userID: data.UserID,
      email: data.Email,
      code: data.Code,
      referralCode: data.ReferralCode,
      referralID: data.ReferralID,
      emailInvite: data.EmailInvite
    };
  }

  static parseTokenData(data = {}) {
    return {
      token: data.Token,
      Expired: data.Expired
    };
  }
}

export default User;