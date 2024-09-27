import { BaseModel } from "../../../../infra/database/BaseModel";

class LineAuthModel extends BaseModel {
  public uid!: Buffer;

  public lineId!: string;

  public isValid!: number;

  public static get tableName(): string {
    return "LineAuth";
  }

  public static get idColumn(): string {
    return "uid";
  }
}

export { LineAuthModel };
