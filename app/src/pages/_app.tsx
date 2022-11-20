import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Index from "."
import "../styles/globals.scss"
import AddReadModelPage from "./add_read_model"
import NotFound from "./not_found"
import ReadModelPage from "./read_model"
import Root from "./_root"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        errorElement: <NotFound />,
        children: [
          {
            index: true,
            element: <Index />,
          },
          {
            path: "/rm/add",
            element: <AddReadModelPage />,
          },
          {
            path: "/rm/:id",
            element: <ReadModelPage />,
          },
        ],
      },
    ],
  },
])

const container = document.getElementById("app") as HTMLElement
const root = ReactDOM.createRoot(container)
root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
