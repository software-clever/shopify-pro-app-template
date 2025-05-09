import { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import { GraphQLConnection } from "app/models/GraphQLData";
import { Product } from "./model/Product";
import { FunctionResponse } from "app/models/FunctionResponse";

export interface ProductManager {
  getProducts(
    graphqlClient: AdminGraphqlClient,
    first: number,
    after: string | null,
  ): Promise<FunctionResponse<GraphQLConnection<Product>>>
  getProduct(graphqlClient: AdminGraphqlClient, id: string): Promise<FunctionResponse<Product>>
}
