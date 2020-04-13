class Settings {
  constructor(json) {
    if (!json) {
      return {};
    }

    this.disableDecentralized = json.DisableDecentralized;
  }
}

export default Settings;
