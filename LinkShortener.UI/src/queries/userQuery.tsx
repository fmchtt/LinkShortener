import { GetActualUser } from "@/services/user";
import { queryOptions } from "@tanstack/react-query";

export const userQuery = queryOptions({
  queryKey: ["user"],
  queryFn: () => GetActualUser(),
  retry: false,
});
