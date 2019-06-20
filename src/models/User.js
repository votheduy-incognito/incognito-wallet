export default class User {
  constructor(userJson: JSON) {}

  toJSON() {
    return {
      id: this.id
    };
  }
}
