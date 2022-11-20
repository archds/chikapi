import { useContext } from "react"
import { Heading, Hero, Tile } from "react-bulma-components"
import { Translation } from "../pages/_root"
import { ReadModelItem, ReadModelObject } from "../services/types"
import { capitalize } from "../services/utils"
import Divider from "./divider"
import BoolView from "./simple/bool"

interface ObjectViewProps {
  content: Record<string, ReadModelItem>
}

function ObjectView(props: ObjectViewProps) {
  const translator = useContext(Translation)

  let header = Object.entries(props.content)
    .map(([k, v]) => {
      switch (v.renderAs) {
        case "simple":
          return v.value
        default:
          return undefined
      }
    })
    .join(" ")

  let tiles = Object.entries(props.content).map(([k, v]) => {
    switch (v.renderAs) {
      case "object":
        let header = (
          <Heading key={k} subtitle size={4}>
            {capitalize(v.prefix || translator[k] || k)}
          </Heading>
        )
        let value = v.value as Record<string, any>
        let content = Object.entries(value).map(([k, v]) => {
          if (typeof v === "object") {
            v = "..."
          }

          if (typeof v === "boolean") {
            v = <BoolView key={k} checked={v} />
          }

          return (
            <p key={k}>
              <span className="has-text-grey">{capitalize(translator[k] || k)}</span>: <span className="ml-1">{v}</span>
            </p>
          )
        })
        content.unshift(header)
        return (
          <Tile key={k} kind="child" className="box" size={12}>
            {content}
          </Tile>
        )
    }
  })

  const middle = Math.ceil(tiles.length / 2)
  const one_side = tiles.slice(0, middle)
  const another_side = tiles.slice(middle)

  return (
    <>
      <Heading size={1} textColor="grey-darker">
        {header}
      </Heading>
      <Divider text="data" className="is-primary" />
      <Tile kind="ancestor">
        <Tile kind="parent" size={6} vertical>
          {one_side}
        </Tile>
        <Tile kind="parent" size={6} vertical>
          {another_side}
        </Tile>
      </Tile>
    </>
  )
}

export default ObjectView
