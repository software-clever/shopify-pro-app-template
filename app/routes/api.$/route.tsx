import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../../shopify.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.log("api/auth.$.tsx loader called");
  await authenticate.admin(request);

  return null;
};