import { createBrowserRouter } from "react-router";
import { H1 } from "./components/ui/typography";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/index")
  },
  {
    path: "/login",
    lazy: () => import("./pages/login")
  },
  {
    path: "/signup",
    lazy: () => import("./pages/signup")
  },
  {
    path: "*",
    lazy: () => import("./components/ui/page/not-found")
  }
])

export function App() {
  return (
    <div className="size-full">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}
