import { Toaster } from "./components/ui/sonner";
import { StrictMode } from "react";
import "../styles/globals.css";

export function App({
  children,
}: { router?: any; children?: React.ReactNode } = {}) {
  return (
    <StrictMode>
      <div className="size-full">
        {children}
        <Toaster />
      </div>
    </StrictMode>
  );
}
