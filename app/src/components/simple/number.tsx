interface NumberViewProps {
  value: number
}

function NumberView(props: NumberViewProps) {
  return (
    <>
      <h1 className="has-text-centered is-size-2">The value is</h1>
      <h1 className="has-text-centered has-text-info-dark has-text-weight-semibold is-size-1">{props.value}</h1>
    </>
  )
}

export default NumberView
