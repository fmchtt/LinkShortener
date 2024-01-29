import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({
        to: "/",
      });
    }
  },
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate({ from: "/login" });
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate({
        to: "/",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const schema = z.object({
    email: z.string().email({ message: "Email em formato inválido!" }),
    password: z.string().min(4, "A senha precisa ter no mínimo 4 digitos"),
  });

  const loginForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    setLoading(true);
    login({ email: values.email, password: values.password })
      .then(() => {
        navigate({ to: "/" });
      })
      .catch(() => {
        loginForm.setError("root", { message: "Usuário ou senha inválidos!" });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="w-1/5 min-h-screen flex flex-col justify-center align-middle bg-slate-700 border-r-slate-800 border-r-2">
      <h1 className="text-center text-2xl text-white">Link Shortner</h1>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className="space-y-8 self-center w-full p-10"
        >
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-stone-100">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@email.com"
                      className="bg-transparent placeholder:text-white text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-stone-100">Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="*************"
                      className="bg-transparent placeholder:text-white text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button disabled={loading} type="submit" className="bg-slate-900">
            Entrar
          </Button>
        </form>
      </Form>
    </div>
  );
}
