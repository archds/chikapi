export interface Command {}

export interface ReadModel {
  id: string
  name: string
}

type RenderAs = "table" | "list" | "object" | "simple"
type Value = object | number | string | boolean | null

export interface ReadModelItem {
  prefix: string
  value: Value
  renderAs: RenderAs
}

export interface ReadModelArrayItem {
  data: ReadModelItem[]
  reference: Value[]
}

export interface ReadModelTable {
  data: ReadModelArrayItem[]
  renderAs: "table"
}

export interface ReadModelList {
  data: ReadModelArrayItem[]
  renderAs: "list"
}

export interface ReadModelObject {
  data: { [key: string]: ReadModelItem }
  renderAs: "object"
}

export interface ReadModelSimple {
  data: ReadModelItem
  renderAs: "simple"
}

export type ReadModelData = ReadModelTable | ReadModelList | ReadModelObject | ReadModelSimple
