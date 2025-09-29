export class Success {
  public payload: any;
  public headers: {};
  constructor(payload: any, headers: {} = {}) {
    this.payload = payload;
    this.headers = headers;
  }
}
