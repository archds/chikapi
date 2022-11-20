interface DividerProps {
  vertical?: boolean
  text?: string
  className?: string
}

function Divider(props: DividerProps) {
  let className = "divider " + props.className

  switch (props.vertical) {
    case true:
      className += " is-vertical"
    default:
      break
  }

  return <div className={className}>{props.text}</div>
}

export default Divider
