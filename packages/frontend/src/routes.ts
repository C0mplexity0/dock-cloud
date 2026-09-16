export const routes = [
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
]
