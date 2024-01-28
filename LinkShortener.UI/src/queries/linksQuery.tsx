import { getLinks } from "@/services/link";
import { queryOptions } from "@tanstack/react-query";

export const linksQuery = queryOptions({
  queryKey: ["links"],
  queryFn: () => getLinks(),
});
