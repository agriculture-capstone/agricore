import { SinonSandbox, SinonStub } from 'sinon';

/** Response stub for express */
export class ResponseStub {
  /** status method stub */
  public status: SinonStub;

  /** end method stub */
  public end: SinonStub;

  /** sendStatus method stub */
  public sendStatus: SinonStub;

  private sandbox: SinonSandbox;
  private stubs: SinonStub[];

  public constructor(sandbox: SinonSandbox) {
    this.stubs = [];
    this.sandbox = sandbox;
    this.status = this.createChainStub();
    this.sendStatus = this.createChainStub();
    this.end = this.createStub();
  }

  /**
   * Check if any of the stubs contained on the instance have been called
   *
   * @returns {boolean} whether or not any stubs have been called
   */
  public anyCalled() {
    return !!this.stubs.find((stub) => {
      return stub.called;
    });
  }

  /**
   * Used to create a stub that returns the instance
   */
  private createChainStub() {
    return this.saveStub(this.sandbox.stub().returns(this));
  }

  /**
   * Used to create a stub
   */
  private createStub() {
    return this.saveStub(this.sandbox.stub());
  }

  private saveStub(stub: SinonStub) {
    this.stubs.push(stub);
    return stub;
  }
}
