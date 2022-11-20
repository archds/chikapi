import { Box, Table } from "react-bulma-components"
import { ReadModelArrayItem, ReadModelItem } from "../../services/types"

interface TableViewProps {
  content: ReadModelArrayItem[]
}

function TableView(props: TableViewProps) {
  let headers = props.content[0].data.map((item) => {
    return <th key={item.prefix}>{item.prefix}</th>
  })

  let content = props.content.map((item, i) => {
    let row = item.data.map((entry) => {
      return <td key={entry.value}>{entry.value}</td>
    })
    return (
      <tr className={item.reference && "is-clickable"} key={i}>
        {row}
      </tr>
    )
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
