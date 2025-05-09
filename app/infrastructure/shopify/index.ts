import type { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import { GraphQLQueryResult } from "app/models/GraphQLData";
import FileContentReader from "../../infrastructure/FileContentReader";
import logger from "app/utils/logger";

export interface ShopifyQueryExecutorInterface {
  queryByName<T>(
    graphqlClient: AdminGraphqlClient,
    name: string,
    variables?: Record<string, any>,
  ): Promise<GraphQLQueryResult<T>>;
}
export class ShopifyQueryExecutor implements ShopifyQueryExecutorInterface {
  constructor(private readonly fileContentReader: FileContentReader) {}

  public async queryByName<T>(
    graphqlClient: AdminGraphqlClient,
    name: string,
    variables?: Record<string, any>,
  ): Promise<GraphQLQueryResult<T>> {
    const query = await this.fileContentReader.read(name);

    if (!query || query.trim().length === 0) {
      return {
        data: undefined,
        errors: { message: `Query named '${name}' not found or empty.` },
      };
    }
    try {
      const response = await graphqlClient(query, { variables });
      const json = await response.json();
      return json;
    } catch (err) {
      const error = {
        data: undefined,
        errors: { message: "Could not run query: " },
      };
      if (err instanceof Error) {
        error.errors.message = error.errors.message + err.message;
        logger.error({ err }, error.errors.message);
      } else {
        error.errors.message = error.errors.message + err;
        logger.error(error.errors.message);
      }      
      return error;
    }
  }
}
