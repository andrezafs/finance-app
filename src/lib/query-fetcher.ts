import { ENV } from "@/config/env";
import { GraphQLClient, Variables, gql } from "graphql-request";
import { sessionManager } from "./session-manager";
import { loginRoute, rootRoute } from "@/routes";

async function refreshAccessToken(
  currentToken: string
): Promise<string | null> {
  try {
    const request = await fetch(ENV.VITE_BFF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify({
        query: gql`
          mutation RefreshAccess {
            refresh {
              token
            }
          }
        `,
      }),
    });
    const response = await request.json();

    return response.data.refresh.token;
  } catch {
    return null;
  }
}

export async function getAccessTokenSilently(): Promise<string | null> {
  const { token, isValid } = sessionManager.getToken();

  if (isValid) {
    return token;
  }

  if (token) {
    const newToken = await refreshAccessToken(token);

    if (!newToken) {
      return null;
    }

    sessionManager.authenticate(newToken);

    return newToken;
  }

  return null;
}

async function requestMiddleware(request: RequestInit): Promise<RequestInit> {
  const token = await getAccessTokenSilently();

  return {
    ...request,
    headers: {
      ...request.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

async function responseMiddleware(response: Response): Promise<Response> {
  const isUnauthenticated = JSON.stringify(response).includes("Unauthorized");
  const isAuthenticatedMethod = JSON.stringify(response).includes(
    '"path":["authenticate"]'
  );

  if (isUnauthenticated && !isAuthenticatedMethod) {
    sessionManager.logout();

    const { pathname } = window.location;

    window.location.href =
      pathname === rootRoute.path
        ? loginRoute.path
        : `${loginRoute.path}?redirect=${pathname}`;
  }

  return response;
}

export const graphQLClient = new GraphQLClient(ENV.VITE_BFF_URL, {
  requestMiddleware: requestMiddleware as any,
  responseMiddleware: responseMiddleware as any,
  headers: {
    "apollo-require-preflight": "true",
    "Content-Type": "application/json",
  },
});

export const fetcherWithGraphQLClient = <
  TData = any,
  TVariables extends Variables = any,
>(
  query: string,
  variables?: TVariables
): (() => Promise<TData>) => {
  return async () => {
    return graphQLClient.request<TData>(query, variables);
  };
};
