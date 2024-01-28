import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({
        to: "/",
      });
    }
  },
});

export default function RegisterPage() {
  return <></>;
}
