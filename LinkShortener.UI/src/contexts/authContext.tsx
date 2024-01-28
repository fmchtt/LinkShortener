import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, createContext, useEffect } from "react";
import {
  GetActualUser,
  Login,
  LoginBody,
  Register,
  RegisterBody,
} from "../services/user";
import http from "../services/http";
import { redirect } from "@tanstack/react-router";
import { userQuery } from "@/queries/userQuery";

export type User = {
  name: string;
  email: string;
};

export type AuthContextProps = {
  user: User | undefined;
  isLoading: boolean;
  login: (loginParams: LoginBody) => Promise<void>;
  register: (registerParams: RegisterBody) => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  isLoading: true,
  login: async () => {},
  register: async () => {},
});

export function AuthContextProvider(props: PropsWithChildren) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => GetActualUser(),
    retry: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, []);

  const client = useQueryClient();

  http.interceptors.response.use(
    (success) => {
      return success;
    },
    (error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem("token");
        http.defaults.headers.common.Authorization = null;
        client.setQueryData(["user"], null);
        throw redirect({
          to: "/login",
        });
      }

      return Promise.reject(error);
    }
  );

  async function login(loginParams: LoginBody) {
    const token = await Login(loginParams);
    http.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
    localStorage.setItem("token", token.accessToken);
    client.prefetchQuery(userQuery);
  }

  async function register(registerParams: RegisterBody) {
    const token = await Register(registerParams);
    http.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
    localStorage.setItem("token", token.accessToken);
    client.prefetchQuery(userQuery);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, isLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
}
