import { ShopifyDataManagers } from "app/adapters/DataManager";
import { GraphQLProductManager } from "app/infrastructure/shopify/GraphQLProductManager";
import { ShopifyQueryExecutorInterface, ShopifyQueryExecutor } from ".";
import FileContentReader from "../FileContentReader";
import { ProductManager } from "app/domain/product/ProductManager";

export default class DataManager implements ShopifyDataManagers {
  productManager: ProductManager;
  constructor() {
    const fileContentReader = new FileContentReader();
    const queryExecutor: ShopifyQueryExecutorInterface = new ShopifyQueryExecutor(fileContentReader);
    this.productManager = new GraphQLProductManager(queryExecutor);
  }
  
}
