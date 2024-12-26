class Buster {
  constructor() {
    this.agentId = 0;
    this.apiKey = '';
    this.argument = {};
  }

  async setResultObject(object) {
    console.log('Result set:', object);
  }
}

module.exports = Buster;
