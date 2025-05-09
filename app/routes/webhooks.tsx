import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import logger from "app/utils/logger";
import { dataManagers } from "app/adapters/DataManager";

export const action = async ({ request }: ActionFunctionArgs) => {
    const { topic, shop, admin } = await authenticate.webhook(request);
    if (!admin && topic !== "SHOP_REDACT") {
        // The admin context isn't returned if the webhook fired after a shop was uninstalled.
        // The SHOP_REDACT webhook will be fired up to 48 hours after a shop uninstalls the app.
        // Because of this, no admin context is available.
        logger.warn("You have called a webhook without an admin context");
        throw new Response();
    }
    switch (topic.toUpperCase()) {
      case "APP_UNINSTALLED":
        logger.debug(`webhooks uninstall initiated from ${shop}`);
        await dataManagers.pg.shopSessionManager.deleteShopSession(shop);
        break;
      case "APP_SUBSCRIPTIONS_UPDATE":
        break;
    }    


  return new Response();
};
