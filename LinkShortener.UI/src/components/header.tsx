import useAuth from "@/hooks/useAuth";
import { Button } from "./ui/button";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-slate-700 p-8 flex justify-between">
      <ul>
        <li className="text-lg">Link Shortener</li>
      </ul>
      <div className="flex gap-4 justify-center items-center">
        <p>{user?.name}</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            logout();
          }}
        >
          Sair
        </Button>
      </div>
    </nav>
  );
}
