import { Progress } from "react-bulma-components"
import { useIsFetching } from "react-query"
import { Navigate, useLoaderData } from "react-router"
import FullScreenLoader from "../components/loader"
import ObjectView from "../components/object"
import TableView from "../components/table"
import { useReadModel } from "../hooks"
import { ReadModelItem, ReadModelData } from "../services/types"
import NotFound from "./not_found"

function ReadModelPage() {
  const { data, status, error } = useReadModel()

  if (status === "loading" || !data) {
    return <FullScreenLoader loading color="primary" scale={1.3} style="ellipsis" />
  }

  if (status === "error") {
    console.error(error)
    return <Navigate to="/404" />
  }

  switch (data.renderAs) {
    case "table":
      return <TableView content={data.data} />
    case "object":
      return <ObjectView content={data.data} />
    default:
      return <NotFound />
  }
}

export default ReadModelPage
