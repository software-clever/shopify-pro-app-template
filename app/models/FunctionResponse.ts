export type FunctionResponse<T> = {
  Response: T | undefined;
  Messages: ResponseMessage[];
};
export interface ResponseMessage {
    isError: boolean;
    message: string;
};