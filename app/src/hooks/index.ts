import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { fetchReadModelData } from "../services/read_models"
import { ReadModelData } from "../services/types"

interface UseReadModelResult {
    data: ReadModelData | undefined
    error: Error | null
    status: "idle" | "error" | "loading" | "success"
}

export function useReadModel(): UseReadModelResult {
    let params = useParams()

    if (!params.id) {
        return {
            data: undefined,
            error: new Error("Unresolved parameter or schema!"),
            status: "error",
        }
    }

    let readModelId = params.id

    let fetch = () => fetchReadModelData(readModelId)
    let { data, status, error } = useQuery<ReadModelData, Error>(
        ["readModel", params.id],
        fetch
    )

    return { data, status, error }
}
