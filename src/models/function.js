class FunctionConfigModel {
  constructor(data) {
    if (!data) {
      return {};
    }

    this.name = data.Name;
    this.message = data.Message;
    this.disabled = data.Disable;
  }
}

export default FunctionConfigModel;
