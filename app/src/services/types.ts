export interface Command {}

export interface ReadModel {
    id: string
    name: string
}

export interface ReadModelItem {
    [key: string]: {
        prefix: string
        value: any
    }
}

export interface ReadModelTable {
    data: ReadModelItem[]
    renderAs: "table"
}

export interface ReadModelList {
    data: ReadModelItem[]
    renderAs: "list"
}

export interface ReadModelObject {
    data: ReadModelItem
    renderAs: "object"
}

export interface ReadModelSimple {
    data: null | number | string | boolean
    renderAs: "simple"
}

export type ReadModelData =
    | ReadModelTable
    | ReadModelList
    | ReadModelObject
    | ReadModelSimple
