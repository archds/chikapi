import { Progress } from "react-bulma-components"
import { useIsFetching } from "react-query"
import { Navigate, useLoaderData } from "react-router"
import ObjectView from "../components/object"
import TableView from "../components/table"
import { useReadModel } from "../hooks"
import { ReadModelItem, ReadModelData } from "../services/types"
import NotFound from "./not_found"

function ReadModelPage() {
  const { data, status, error } = useReadModel()

  if (status === "loading") {
    return <Progress />
  }

  if (status === "error") {
    return <Navigate to="/404" />
  }

  if (!data) {
    return <Progress />
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
