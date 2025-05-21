import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import {
  AppProvider as PolarisProvider,     // Polaris v13 provider
  Page,
  Card,
  Icon,
  Text,
  Button,
  BlockStack,      // vertical layout
  InlineStack,     // horizontal layout
} from '@shopify/polaris';
import { AlertCircleIcon } from '@shopify/polaris-icons';
import en from '@shopify/polaris/locales/en.json';     // <-- default English messages
import { publicEnv, env } from 'app/env.server';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import logger from "./utils/logger";
import { isServer } from 'app/utils/isomorphic';
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import polaris_override_styles from "app/styles/polaris_override.css?url";
export const meta: MetaFunction = () => [{ title: env.PUBLIC_APP_NAME }];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: polarisStyles },
  { rel: "stylesheet", href: polaris_override_styles },
];
export const loader = () => {
  return { env: publicEnv };
};

export default function App() {
  const {env: runtimeEnv} = useLoaderData<typeof loader>();
  return (
    <html lang="en" data-app-url={runtimeEnv.PUBLIC_APP_URL}>
      <head>
        <Meta /><Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration /><Scripts />
      </body>
    </html>
  );
}
/* ────────────────────────────────────────────────────────── */
/* GLOBAL ERROR BOUNDARY – handles *all* uncaught exceptions */
/* – Runs both on server *and* in the client bundle.         */
/* ────────────────────────────────────────────────────────── */
export function ErrorBoundary() {
  const error = useRouteError();

  if (isServer()) {
    logger.error({ err: error }, 'Unhandled exception');
    if (env.BUGSNAG_KEY) {
      Bugsnag.start({ apiKey: env.BUGSNAG_KEY });
      Bugsnag.notify(error as Error);
    }
  } else {
    const apiKey = (window as any).ENV?.BUGSNAG_KEY;
    if (apiKey) {
      Bugsnag.start({
        apiKey,
        plugins: [new BugsnagPluginReact()],
      });
      Bugsnag.notify(error as any);
    }
  }

  return (
    <html lang="en" data-app-url={env.PUBLIC_APP_URL}>
      <head>
        <Meta />
        <Links />
      </head>

      <body>
        {/* Polaris context — only needs i18n in the error path */}
        <PolarisProvider i18n={en}>
          <Page fullWidth> {/* gives us Polaris spacing tokens */}
            <BlockStack align="center" gap="600">
              <Card>
                <BlockStack align="center" gap="400">
                  <Icon source={AlertCircleIcon} tone="critical" />
                  <Text as="h1" variant="headingLg" fontWeight="semibold" alignment="center">
                    Something went wrong
                  </Text>
                  <Text as="p" alignment="center">
                    Our team has been notified and is looking into it.
                  </Text>

                  <InlineStack gap="200" wrap={false}>
                    <Button variant="primary" onClick={() => window.location.reload()}>
                      Reload page
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Page>
        </PolarisProvider>

        <Scripts />
      </body>
    </html>
  );
}
