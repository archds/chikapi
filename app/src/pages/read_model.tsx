import { Progress } from "react-bulma-components"
import { Navigate } from "react-router"
import TableView from "../components/table"
import { useReadModel } from "../hooks"
import { ReadModelItem } from "../services/types"

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
            let readModelData = data.data as ReadModelItem[]
            return <TableView content={readModelData} />
        default:
            return <Navigate to="/404" />
    }
}

export default ReadModelPage
