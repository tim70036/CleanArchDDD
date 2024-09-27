import Objection, { Model } from "objection";
import { CreateLogger } from "../common/Logger";

class Transaction {
  public static readonly logger = CreateLogger("Transaction");

  public static readonly statusCheckIntervalMs = 10000;

  public static readonly lifeTimeThresholdMs = 60000;

  public readonly source: string;

  private readonly rawTrx: Objection.Transaction;

  private readonly timer: NodeJS.Timeout;

  private lifeTime: number;

  private constructor(trx: Objection.Transaction, source: string) {
    this.rawTrx = trx;
    this.source = source;
    this.lifeTime = 0;
    this.timer = setInterval(
      this.CheckStatus,
      Transaction.statusCheckIntervalMs,
    );

    Transaction.logger.debug(`start`, {
      source: source,
    });
  }

  public get Raw(): Objection.Transaction {
    return this.rawTrx;
  }

  public static async Acquire(source: string): Promise<Transaction> {
    const rawTrx = await Model.startTransaction();
    return new Transaction(rawTrx, source);
  }

  public async Commit(): Promise<void> {
    Transaction.logger.debug(`commit`, {
      source: this.source,
    });
    await this.rawTrx.commit();
    clearInterval(this.timer);
  }

  public async Rollback(): Promise<void> {
    Transaction.logger.debug(`rollback`, {
      source: this.source,
    });
    await this.rawTrx.rollback();
    clearInterval(this.timer);
  }

  public IsCompleted(): boolean {
    return this.rawTrx.isCompleted();
  }

  // Very important for production safety. In the past, there were
  // some programmers forgot to commit trx that causes server
  // outrage. This can help pinpoint the problem.
  private readonly CheckStatus = (): void => {
    if (this.IsCompleted()) {
      clearInterval(this.timer);
      return;
    }

    this.lifeTime += Transaction.statusCheckIntervalMs;
    if (this.lifeTime >= Transaction.lifeTimeThresholdMs)
      clearInterval(this.timer);

    Transaction.logger.warn(`running too long`, {
      source: this.source,
      lifeTimeMs: this.lifeTime,
    });
  };
}

export { Transaction };
