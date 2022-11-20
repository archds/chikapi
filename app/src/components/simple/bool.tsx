interface BoolViewProps {
  checked: boolean
}

function BoolView(props: BoolViewProps) {
  let colorClassName = "has-text-success-dark"
  let val = "true"

  switch (props.checked) {
    case true:
      colorClassName = "has-text-success-dark"
      val = "true"
    case false:
      colorClassName = "has-text-danger-dark"
      val = "false"
    default:
      let _: never
  }

  return (
    <>
      <h1 className="has-text-centered is-size-2">
        The value is:
        <span className={`has-text-weight-semibold ${colorClassName}`}>{val}</span>
      </h1>
    </>
  )
}

export default BoolView
