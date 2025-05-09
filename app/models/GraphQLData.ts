export interface GraphQLConnection<T> {
  edges?: Edges<T>[];
  nodes?: T[];
  pageInfo?: PageInfo;
}
export interface Edges<T> {
  cursor: string;
  node: T;
}
export interface PageInfo {
  endCursor?: string | null;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string | null;
}
export interface GraphQLQueryResult<T> {
  data?: T;
  errors?: Errors;
}
export interface Errors {
  networkStatusCode?: number;
  message: string;
  GraphQLErrors?: GraphQLError[];
}
export interface GraphQLError {
  message: string;
  locations: ErrorLocation[];
  path: string[];
  extensions: ErrorExtension;
}
export interface ErrorLocation {
  line: number;
  column: number;
}
export interface ErrorExtension {
  code: string;
  documentions: string;
}
export type SingleObjectResponse<
  TName extends string,
  TObject
> = {
  [key in TName]: TObject;
};
export type ConnectionResponse<
  TName extends string,
  TObject
> = {
  [key in TName]: GraphQLConnection<TObject>;
};
