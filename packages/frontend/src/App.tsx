import { Button } from "./components/ui/button";
import { H1 } from "./components/ui/typography";

export function App() {
  return (
    <div className="size-full flex flex-row">
      <div className="p-2 border-r h-full bg-background-secondary flex flex-col gap-2">
        <Button size="icon" variant="secondary"></Button>
      </div>
    </div>
  )
}
