class Buster {
  public agentId = 12345;
  public apiKey = 'mock-api-key';
  public argument = { query: 'mock-query', pages: 1 };
  public containerId = 67890;

  async setResultObject(result: object): Promise<void> {
    console.log('Mock Result:', result);
  }

  async solveCaptcha(selector: string): Promise<string> {
    return 'mock-captcha-solution';
  }
}

export default Buster;
