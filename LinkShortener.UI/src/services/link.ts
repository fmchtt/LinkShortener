import http from "./http";

export type Link = {
  id: string;
  href: string;
  hash: string;
};

export async function getLinks() {
  const { data } = await http.get<Link[]>("links");
  return data;
}

export async function deleteLink(linkId: string) {
  const { data } = await http.delete(`links/${linkId}/`);
  return data;
}
