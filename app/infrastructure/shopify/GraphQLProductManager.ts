import { ShopifyQueryExecutorInterface } from ".";
import logger from "app/utils/logger";
import {
  ConnectionResponse,
  GraphQLConnection,
  SingleObjectResponse,
} from "app/models/GraphQLData";
import { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import { ProductManager } from "app/domain/product/ProductManager";
import { Product } from "app/domain/product/model/Product";
import { FunctionResponse, ResponseMessage } from "app/models/FunctionResponse";
import { getResponseMessageFromGraphQLQueryResult } from "app/utils/getResponseMessage";

export class GraphQLProductManager implements ProductManager {
  constructor(private readonly queryExecutor: ShopifyQueryExecutorInterface) {}
  public async getProducts(
    graphqlClient: AdminGraphqlClient,
    first: number,
    after: string | null,
  ): Promise<FunctionResponse<GraphQLConnection<Product>>> {
    const response: FunctionResponse<GraphQLConnection<Product>> = {
      Response: undefined,
      Messages: [],
    };
    try {
      const result = await this.queryExecutor.queryByName<
        ConnectionResponse<"products", Product>
      >(graphqlClient, "getProducts.graphql", { first: first, after: after });
      if(result.data?.products) response.Response = result.data.products;
      const responseMessages: ResponseMessage[] = getResponseMessageFromGraphQLQueryResult(result);
      response.Messages.push(...responseMessages);
    } catch (err) {
      console.log("getProducts error", err);
      const respMessage: ResponseMessage = {
        isError: true,
        message: "Could not get products: "
      };
      if (err instanceof Error) {
        respMessage.message = respMessage.message + err.message;
        logger.error({ err }, respMessage.message);
      } else {
        respMessage.message = respMessage.message + err;
        logger.error(respMessage.message);
      } 
      response.Messages.push(respMessage);
    }
    return response;
  }
  public async getProduct(graphqlClient: AdminGraphqlClient, id: string): Promise<FunctionResponse<Product>> {
    const response: FunctionResponse<Product> = {
      Response: undefined,
      Messages: [],
    };
    try {
      const result = await this.queryExecutor.queryByName<
        SingleObjectResponse<"product", Product>
      >(graphqlClient, "getProduct.graphql", { id: id });
      if(result.data?.product) response.Response = result.data.product;
      const responseMessages: ResponseMessage[] = getResponseMessageFromGraphQLQueryResult(result);
      response.Messages.push(...responseMessages);
    } catch (err) {
      console.log("getProduct error", err);
      const respMessage: ResponseMessage = {
        isError: true,
        message: "Could not get product: "
      };
      if (err instanceof Error) {
        respMessage.message = respMessage.message + err.message;
        logger.error({ err }, respMessage.message);
      } else {
        respMessage.message = respMessage.message + err;
        logger.error(respMessage.message);
      } 
      response.Messages.push(respMessage);
    }
    return response;
  }
}
