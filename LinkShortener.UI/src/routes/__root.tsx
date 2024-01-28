import { Outlet, rootRouteWithContext } from "@tanstack/react-router";
import { AuthContextProps } from "../contexts/authContext";
import { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

type RootRouteContext = {
  auth: AuthContextProps;
  queryClient: QueryClient;
};

export const Route = rootRouteWithContext<RootRouteContext>()({
  component: RootLayout,
});

export function RootLayout() {
  return (
    <div className="bg-slate-900 min-h-screen">
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
    </div>
  );
}
