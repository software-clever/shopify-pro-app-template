import { PGDataManagers } from "app/adapters/DataManager";
import { ShopSessionManager } from "app/domain/session/ShopSessionManager";
import { getPool } from "./createPool";
import FileContentReader from "../FileContentReader";
import { QueryExecutor } from ".";
import { PGShopSessionManager } from "./PGShopSessionManager";


export default class DataManagers implements PGDataManagers {
  shopSessionManager: ShopSessionManager;
  constructor() {
    const pool = getPool();
    const fileContentReader = new FileContentReader();
    const queryExecutor = new QueryExecutor(pool, fileContentReader);
    this.shopSessionManager = new PGShopSessionManager(queryExecutor);
  }
}