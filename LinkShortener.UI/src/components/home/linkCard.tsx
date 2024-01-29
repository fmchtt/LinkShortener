import { Link, deleteLink } from "@/services/link";
import { Card, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { TbLoader2 } from "react-icons/tb";
import { IoCopyOutline, IoTrashOutline } from "react-icons/io5";
import { useToast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";

type LinkCardProps = {
  link: Link;
};

export default function LinkCard({ link }: LinkCardProps) {
  const { toast } = useToast();
  const client = useQueryClient();

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

  function copyToClipboard(content: string) {
    navigator.clipboard.writeText(content);
    toast({ title: "Copiado com sucesso!" });
  }

  return (
    <Card className="bg-transparen p-2 flex gap-2">
      <CardDescription>
        <span className="text-white block">
          <strong>Link: </strong>
          <a href={link.href} target="_blank" rel="norel">
            {link.href}
          </a>
        </span>
        <span className="text-white block">
          <strong>Hash: </strong>
          <a
            href={`${import.meta.env.VITE_API_URL}${link.hash}`}
            target="_blank"
            rel="norel"
          >
            {link.hash}
          </a>
        </span>
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
        <Button
          className="bg-transparent hover:bg-slate-400"
          onClick={() =>
            copyToClipboard(`${import.meta.env.VITE_API_URL}${link.hash}`)
          }
        >
          <IoCopyOutline size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
}
