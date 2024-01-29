import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { CreateLinkParams, Link, createLink } from "@/services/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TbLoader2 } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { produce } from "immer";

export default function CreateLinkForm() {
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

  return (
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
        <Button type="submit" variant="secondary">
          {createMutation.isPending ? (
            <TbLoader2 className="animate-spin" size={18} />
          ) : (
            "Criar"
          )}
        </Button>
      </form>
    </Form>
  );
}
