import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, createContext } from "react";
import { Login, LoginBody, Register, RegisterBody } from "../services/user";
import http from "../services/http";
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
  logout: () => void;
};

export const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthContextProvider(props: PropsWithChildren) {
  const { data: user, isLoading } = useQuery(userQuery);

  const client = useQueryClient();

  async function login(loginParams: LoginBody) {
    const token = await Login(loginParams);
    localStorage.setItem("token", token.accessToken);
    http.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
    client.prefetchQuery(userQuery);
  }

  async function register(registerParams: RegisterBody) {
    const token = await Register(registerParams);
    localStorage.setItem("token", token.accessToken);
    http.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
    client.prefetchQuery(userQuery);
  }

  function logout() {
    localStorage.removeItem("token");
    http.defaults.headers.common.Authorization = null;
    client.setQueryData(["user"], null);
    if (location.pathname !== "/login") location.href = "/login";
  }

  http.interceptors.response.use(
    (success) => {
      return success;
    },
    (error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        logout();
      }

      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}
