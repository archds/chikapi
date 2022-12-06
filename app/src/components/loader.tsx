import { ReactNode, useEffect, useState } from "react"
import { Color } from "react-bulma-components/src/components"

type FullScreenLoaderProps = {
  loading: boolean
  background?: Color
  color: Color
  scale?: number
  style: "grid" | "ellipsis"
}

function LoaderContainer(props: { children: ReactNode; background?: Color }) {
  return (
    <div
      className={`has-background-${props.background} is-flex is-justify-content-center is-align-items-center loading-container`}
    >
      {props.children}
    </div>
  )
}

function GridLoader(props: FullScreenLoaderProps) {
  return (
    <div className="lds-grid" style={{ transform: `scale(${props.scale})` }}>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
    </div>
  )
}

function EllipsisLoader(props: FullScreenLoaderProps) {
  return (
    <div className="lds-ellipsis" style={{ transform: `scale(${props.scale})` }}>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
      <div className={`has-background-${props.color}`}></div>
    </div>
  )
}

export default function FullScreenLoader(props: FullScreenLoaderProps) {
  let [loading, setLoading] = useState(props.loading)

  useEffect(() => {
    setLoading(props.loading)
  }, [props.loading])

  switch (props.style) {
    case "grid":
      return (
        <LoaderContainer background={props.background}>
          <GridLoader {...props} />
        </LoaderContainer>
      )
    case "ellipsis":
      return (
        <LoaderContainer background={props.background}>
          <EllipsisLoader {...props} />
        </LoaderContainer>
      )
  }
}
