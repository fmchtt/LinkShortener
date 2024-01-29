import { Skeleton } from "@/components/ui/skeleton";
import { linksQuery } from "@/queries/linksQuery";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import Header from "@/components/header";
import CreateLinkForm from "@/components/home/createLinkForm";
import LinkCard from "@/components/home/linkCard";

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
  const { data } = useSuspenseQuery(linksQuery);

  return (
    <div className="text-white">
      <Header />
      <main className="w-full flex h-[calc(100vh-92px)]">
        <section className="min-w-80 bg-slate-600 p-4">
          <CreateLinkForm />
        </section>
        <section className="flex-1 flex flex-col gap-2 p-4">
          <h1 className="text-2xl">Meus links:</h1>
          <div className="flex gap-2">
            {data.map((link) => {
              return <LinkCard key={link.id} link={link} />;
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
