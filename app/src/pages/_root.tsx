import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"
import { createBrowserRouter } from "react-router-dom"
import "../styles/globals.scss"
import App from "./_app"

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

function Root() {
    return (
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    )
}

const container = document.getElementById("app") as HTMLElement
const root = ReactDOM.createRoot(container)
root.render(<Root />)
