import { ProductManager } from "app/domain/product/ProductManager";
import { ShopSessionManager } from "app/domain/session/ShopSessionManager";
import PG from "app/infrastructure/pg/DataManagers";
import GQL from "app/infrastructure/shopify/DataManagers";
export interface ShopifyDataManagers {
  productManager: ProductManager;
}
export interface PGDataManagers {
  shopSessionManager: ShopSessionManager;
}
export const dataManagers = {
  get shopify(): ShopifyDataManagers {
    return new GQL();
  },
  get pg(): PGDataManagers {
    return new PG();
  },
};