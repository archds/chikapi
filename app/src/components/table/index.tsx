import { Box, Table } from "react-bulma-components"
import { ReadModelItem } from "../../services/types"

interface TableViewProps {
    content: ReadModelItem[]
}

function TableView(props: TableViewProps) {
    let headers = Object.entries(props.content[0]).map(([k, v]) => {
        return <th key={k}>{v.prefix || k}</th>
    })

    let content = props.content.map((item, i) => {
        let row = Object.entries(item).map(([_, v]) => {
            return <td key={v.value}>{v.value}</td>
        })
        return <tr key={i}>{row}</tr>
    })

    return (
        <Box>
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>{headers}</tr>
                </thead>
                <tbody>{content}</tbody>
            </table>
        </Box>
    )
}

export default TableView
