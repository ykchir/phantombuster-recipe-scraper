export default class Buster {
  public argument: Record<string, any> = {};
  async setResultObject(result: any): Promise<void> {
    console.log('Mocked Result:', result);
  }
}
