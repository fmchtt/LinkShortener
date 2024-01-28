import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import { linksQuery } from "@/queries/linksQuery";
import {
  CreateLinkParams,
  Link,
  createLink,
  deleteLink,
} from "@/services/link";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { IoTrashOutline } from "react-icons/io5";
import { TbLoader2 } from "react-icons/tb";
import { produce } from "immer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

export const Route = createFileRoute("/")({
  component: HomePage,
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: "/login",
      });
    }
  },
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(linksQuery);
  },
  pendingComponent: () => SkeletonHome,
});

function SkeletonHome() {
  return (
    <div>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}

function HomePage() {
  const { user } = useAuth();
  const { data } = useSuspenseQuery(linksQuery);
  const client = useQueryClient();
  const newLinkSchema = z.object({
    href: z.string().url({ message: "Link inválido!" }),
  });
  const newLinkForm = useForm<z.infer<typeof newLinkSchema>>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: {
      href: "",
    },
  });
  const createMutation = useMutation<Link, AxiosError, CreateLinkParams>({
    mutationKey: ["links"],
    mutationFn: (values) => createLink(values),
    onSuccess: (data) => {
      newLinkForm.reset();
      client.setQueryData(
        ["links"],
        produce<Link[]>((draft) => {
          draft.push(data);
        })
      );
    },
  });
  function handleCreate(values: z.infer<typeof newLinkSchema>) {
    createMutation.mutate({ href: values.href });
  }

  const deleteMutation = useMutation({
    mutationKey: ["links"],
    mutationFn: (linkId: string) => deleteLink(linkId),
    onSuccess: (_, linkId) => {
      client.setQueryData(
        ["links"],
        produce<Link[]>((draft) => {
          const index = draft.findIndex((x) => x.id === linkId);
          if (index != -1) {
            draft.splice(index, 1);
          }
        })
      );
    },
  });
  function handleDelete(linkId: string) {
    deleteMutation.mutate(linkId);
  }

  return (
    <div className="text-white">
      <nav className="w-full bg-slate-700 p-8 flex justify-between">
        <ul>
          <li className="text-lg">Link Shortener</li>
        </ul>
        <p>{user?.name}</p>
      </nav>
      <main className="w-full flex h-[calc(100vh-92px)]">
        <section className="flex-1 flex flex-col gap-2 p-4">
          <h1 className="text-2xl">Meus links:</h1>
          <div className="flex gap-2">
            {data.map((link) => {
              return (
                <Card key={link.id} className="bg-transparen p-2 flex gap-2">
                  <CardDescription>
                    <p className="text-white">
                      <strong>Link: </strong>
                      <a href={link.href} target="_blank" rel="norel">
                        {link.href}
                      </a>
                    </p>
                    <p className="text-white">
                      <strong>Hash: </strong>
                      <a
                        href={`${import.meta.env.VITE_API_URL}${link.hash}`}
                        target="_blank"
                        rel="norel"
                      >
                        {link.hash}
                      </a>
                    </p>
                  </CardDescription>
                  <CardFooter className="p-0">
                    <Button
                      className="bg-transparent hover:bg-slate-400"
                      onClick={() => handleDelete(link.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {createMutation.isPending || deleteMutation.isPending ? (
                        <TbLoader2 className="animate-spin" size={18} />
                      ) : (
                        <IoTrashOutline size={18} />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
        <section className="flex-2 min-w-80 bg-slate-600  p-4">
          <Form {...newLinkForm}>
            <form
              onSubmit={newLinkForm.handleSubmit(handleCreate)}
              className="space-y-2"
            >
              <FormField
                control={newLinkForm.control}
                name="href"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Link para encurtar</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent placeholder:text-white"
                          type="url"
                          placeholder="meu.site.com.br"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit">
                {createMutation.isPending || deleteMutation.isPending ? (
                  <TbLoader2 className="animate-spin" size={18} />
                ) : (
                  "Criar"
                )}
              </Button>
            </form>
          </Form>
        </section>
      </main>
    </div>
  );
}
