import { createRouter } from "@tanstack/react-router";
import { AuthContextProps } from "./contexts/authContext";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";

export const router = createRouter({
  routeTree: routeTree,
  context: { auth: {} as AuthContextProps, queryClient: {} as QueryClient },
});
