import { User } from "../contexts/authContext";
import http from "./http";

type AcessTokenResponse = {
  accessToken: string;
};

export type LoginBody = { email: string; password: string };

export async function Login(body: LoginBody) {
  const { data } = await http.post<AcessTokenResponse>("users/login/", body);
  return data;
}

export type RegisterBody = LoginBody & {
  name: string;
};

export async function Register(body: RegisterBody) {
  const { data } = await http.post<AcessTokenResponse>("users/register/", body);
  return data;
}

export async function GetActualUser() {
  const { data } = await http.get<User>("users/me/");
  return data;
}
