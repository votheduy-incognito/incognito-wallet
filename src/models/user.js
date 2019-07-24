const template = {
  email: '',
  country: '',
  fullname: '',
  id: '',
  token: '',
  phone: '',
  user_hash: '',
  gender: 'Male',
  last_update_task: '',
  created_at: '',
  birth: '',
  city: '',
  code: ''
};
class User {
  constructor(data: template) {
    this.data = { ...template, ...data };
  }
  toJSON() {
    return {
      ...this.data
    };
  }
  static getInstance = (data: template): User => {
    return new User(data);
  };
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