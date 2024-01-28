import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import { linksQuery } from "@/queries/linksQuery";
import { Link, deleteLink } from "@/services/link";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { IoTrashOutline } from "react-icons/io5";
import { TbLoader2 } from "react-icons/tb";
import { produce } from "immer";

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

  const deleteMutation = useMutation({
    mutationKey: ["links"],
    mutationFn: (linkId: string) => deleteLink(linkId),
    onSuccess: (data, linkId) => {
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
      <main className="w-full flex p-4">
        <section className="flex-1 flex flex-col gap-2">
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
                      {deleteMutation.isPending ? (
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
        <div className="flex-2">texto</div>
      </main>
    </div>
  );
}
