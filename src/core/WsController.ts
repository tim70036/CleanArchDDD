import { CreateLogger } from "../common/Logger";
import { redisClient } from "../infra/database/Redis";
import { WsMessage } from "./WsMessage";

abstract class WsController {
  public static readonly userChannelPrefix = "uid:";

  public static readonly globalChannelPrefix = "global";

  protected logger;

  public constructor() {
    this.logger = CreateLogger(this.constructor.name);
  }

  public async Execute(wsMessage: WsMessage): Promise<void> {
    this.logger.debug(`-> ws`, {
      eventCode: wsMessage.eventCode,
      srcUid: wsMessage.srcUid,
    });

    try {
      await this.Run(wsMessage);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async Unicast(uid: string, wsMessage: WsMessage): Promise<void> {
    this.logger.debug(`unicast`, {
      targetUid: uid,
      wsMessage: wsMessage.Serialize(),
    });
    await redisClient.publish(
      `${WsController.userChannelPrefix}${uid}`,
      wsMessage.Serialize(),
    );
  }

  public async Broadcast(wsMessage: WsMessage): Promise<void> {
    this.logger.debug(`broadcast`, {
      wsMessage: wsMessage.Serialize(),
    });
    await redisClient.publish(
      WsController.globalChannelPrefix,
      wsMessage.Serialize(),
    );
  }

  protected abstract Run(wsMessage: WsMessage): Promise<void>;
}

export { WsController };
