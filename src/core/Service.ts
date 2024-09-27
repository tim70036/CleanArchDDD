import { CreateLogger } from "../common/Logger";

abstract class Service {
  protected logger;

  public constructor() {
    this.logger = CreateLogger(this.constructor.name);
  }
}

export { Service };
