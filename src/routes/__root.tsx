import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { SDKProvider } from "@tma.js/sdk-react";

export const Route = createRootRoute({
  component: () => {
    const isDevelopment = import.meta.env.MODE === "development";

    return (
      <>
        <SDKProvider acceptCustomStyles debug>
          <Outlet />
          {isDevelopment && <TanStackRouterDevtools />}
        </SDKProvider>
      </>
    );
  },
});
