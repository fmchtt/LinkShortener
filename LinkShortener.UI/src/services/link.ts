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

export type CreateLinkParams = {
  href: string;
};
export async function createLink(body: CreateLinkParams) {
  const { data } = await http.post<Link>(`links/`, body);
  return data;
}

export async function deleteLink(linkId: string) {
  const { data } = await http.delete(`links/${linkId}/`);
  return data;
}
