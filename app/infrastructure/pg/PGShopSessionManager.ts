import { ShopSessionManager } from "app/domain/session/ShopSessionManager";
import { QueryExecutor } from ".";
import logger from "app/utils/logger";


export class PGShopSessionManager implements ShopSessionManager {
  constructor(private readonly queryExecutor: QueryExecutor) {}
  public async deleteShopSession(shop: string): Promise<void> {
    logger.debug(`Uninstall initiated from ${shop}`);
    try {
      await this.queryExecutor.queryByName("deleteShopSession.sql", [
        shop,
      ]);
      logger.debug(`Shop sessions removed from DB: ${shop}`);
    } catch (err) {
      console.log("deleteShopSession error", err);
      if (err instanceof Error) {    
        logger.error(
          { err },
          `Failed to remove shop sessions for ${shop}: ${err.message}`,
        );
      } else {
        logger.error(`Failed to remove shop sessions for ${shop}: ${err}`);
      }
    }
  }
}
