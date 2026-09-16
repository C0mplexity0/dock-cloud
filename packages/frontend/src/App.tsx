import { RouterProvider } from "react-router/dom";
import { Toaster } from "./components/ui/sonner";
import { StrictMode } from "react";
import "../styles/globals.css"

export function App({ router }: { router?: any } = {}) {
  return (
    <StrictMode>
      <div className="size-full">
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </StrictMode>
  )
}
