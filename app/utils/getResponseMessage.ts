import { ResponseMessage } from "app/models/FunctionResponse";
import { GraphQLQueryResult } from "app/models/GraphQLData";

export function getResponseMessageFromGraphQLQueryResult<T>(result: GraphQLQueryResult<T>,): ResponseMessage[] {
  const messages: ResponseMessage[] = [];
  if (result.errors) {
    messages.push({
      isError: true,
      message: result.errors.message || "An error occurred",
    });
    if (Array.isArray(result.errors.GraphQLErrors)) {
        messages.push(
        ...result.errors.GraphQLErrors.map((graphQLError) => ({
          isError: true,
          message: graphQLError.message || "GraphQL error",
        })),
      );
    }
  }
  return messages;
}