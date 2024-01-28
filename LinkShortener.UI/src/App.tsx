import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import useAuth from "./hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

function App() {
  return (
    <RouterProvider
      router={router}
      context={{
        auth: useAuth(),
        queryClient: useQueryClient(),
      }}
    />
  );
}

export default App;
