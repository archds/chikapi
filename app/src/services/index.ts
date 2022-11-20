import { AppError } from "./globals"
import addReadModel, { validateReadModelInput } from "./mutations/add_rm"
import { Result } from "./result"

export type ValidationError<T> = {
  type: "validation"
  data: T
}
export type NetworkError = {
  type: "network"
  data: Error
}

export type MutationError<T> = ValidationError<T> | NetworkError

export type ValidatedInput = Record<string, unknown>
export type UnvalidatedInput = Record<string, unknown>

const mutation = {
  addReadModel: addReadModel,
}

const validate = {
  readModel: validateReadModelInput,
}

export { mutation, validate }
