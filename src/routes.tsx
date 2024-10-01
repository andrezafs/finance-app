import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { z } from "zod";
import CreateAccountForm from "./modules/createAccount/pages/createAccount";
import { Dashboard } from "./modules/dashboard/pages/dashboard";
import { LoginForm } from "./modules/login/pages/login";

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
  path: "orders",
  component: () => <div>Orders</div>,
});

const loginSearchParams = z.object({
  redirect: z.string().optional(),
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  component: LoginForm,
  validateSearch: (search) => loginSearchParams.parse(search),
});

export const createAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "create-account",
  component: CreateAccountForm,
});

export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  ordersRoute,
  loginRoute,
  createAccountRoute,
]);
