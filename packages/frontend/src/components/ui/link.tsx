import { Link as RouterLink } from "react-router"

export function Link({ to, prefetch, ...props }: React.ComponentProps<typeof RouterLink>) {
  return (
    <RouterLink prefetch={prefetch ? prefetch : "none"} to={to} {...props} />
  )
}
