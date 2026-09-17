import { Link as RouterLink } from "react-router";

export function Link({
  to,
  prefetch,
  ...props
}: React.ComponentProps<typeof RouterLink>) {
  return (
    <RouterLink prefetch={prefetch ? prefetch : "intent"} to={to} {...props} />
  );
}
