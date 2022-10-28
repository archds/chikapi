type HashSet<T extends number | string> = Record<T, undefined>
type HashMap<T extends number | string, U> = Record<T, U>
type Vec<T> = Array<T>
type Option<T> = T | undefined
type Result<T, U> = T | U
export interface Command {}
export type Method =
  | { t: "Get"; c: undefined }
  | { t: "Post"; c: undefined }
  | { t: "Put"; c: undefined }
  | { t: "Delete"; c: undefined }
export interface KeyField {
  prefix: Option<string>
  key: string
  size: Option<number>
}
export interface PathParameter {
  value: string
}
export interface Parameter {
  key: string
  value: string
}
export type QueryParameter =
  | { t: "Body"; c: Parameter }
  | { t: "Path"; c: PathParameter }
  | { t: "Query"; c: Parameter }
export type ReferenceParameter = { t: "Body"; c: string } | { t: "Path"; c: string } | { t: "Query"; c: string }
export type ReferenceParameters = Vec<ReferenceParameter>
export interface ReadModelRef {
  to: string
  parameters: ReferenceParameters
}
export type ReadModelStyle = { t: "LIST"; c: undefined } | { t: "TABLE"; c: undefined }
export interface ReadModel {
  path: string
  name: string
  id: string
  key_fields: Vec<KeyField>
  include: Option<Vec<string>>
  parameters: Vec<QueryParameter>
  reference: Option<ReadModelRef>
  root_key: Option<string>
  style: Option<ReadModelStyle>
}
export interface Schema {
  url: string
  has_openapi: boolean
  headers: Option<HashMap<string, string>>
  read_models: Vec<ReadModel>
  commands: Vec<Command>
  translation: HashMap<string, string>
}
