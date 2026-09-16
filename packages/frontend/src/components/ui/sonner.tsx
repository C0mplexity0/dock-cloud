"use client"

import { Toaster as Sonner, toast, type ToasterProps } from "sonner"
import {
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconAlertOctagon,
  IconLoader,
} from "@tabler/icons-react"
import { H1 } from "./typography"
import { Button } from "./button"

export { toast }

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={"dark" as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IconCircleCheck className="size-4" />,
        info: <IconInfoCircle className="size-4" />,
        warning: <IconAlertTriangle className="size-4" />,
        error: <IconAlertOctagon className="size-4" />,
        loading: <IconLoader className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export function ToastDemo() {
  return (
    <div className="flex flex-col gap-2">
      <H1>Toast</H1>
      <Button
        className="w-fit"
        onClick={() => {
          toast("This is a toast notification!", {
            description: "This is a description for the toast notification.",
            action: {
              label: "Undo",
              onClick: () => alert("Undo action clicked!"),
            },
          })
        }}
      >
        Show Toast
      </Button>
    </div>
  )
}

export { Toaster }
