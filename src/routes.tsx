import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Dashboard } from "./modules/dashboard/pages/dashboard";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

export const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: () => <div>Orders</div>,
});

export const routeTree = rootRoute.addChildren([dashboardRoute, ordersRoute]);
