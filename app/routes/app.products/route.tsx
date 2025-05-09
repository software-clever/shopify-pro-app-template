import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import { SerializeFrom } from "app/models/SerializeFrom";
import Client from "./client";
import { Product } from "app/domain/product/model/Product";
import { ResponseMessage } from "app/models/FunctionResponse";
import { dataManagers } from "app/adapters/DataManager";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const functionResp = await dataManagers.shopify.productManager.getProducts(admin.graphql, 20, null);
  const products: Product[] = functionResp.Response?.nodes ?? [];
  const toastMessages: ResponseMessage[] = [];
  return {
    products,
    toastMessages,
  };
};
export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  return null;
}
export type LoaderData = SerializeFrom<typeof loader>;
export type ActionData = SerializeFrom<typeof action>;
export default function UI() {
    const loaderData = useLoaderData<LoaderData>();
    const actionData = useActionData<ActionData>();
    return <Client loaderData={loaderData} actionData={actionData} />;
  }
export interface ClientProps {
    loaderData: LoaderData | undefined;
    actionData: ActionData | undefined;
}