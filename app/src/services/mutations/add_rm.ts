import { UseMutationResult, useQuery, UseQueryResult } from "react-query"
import { ActionFunctionArgs } from "react-router"
import { MutationError, ValidationError } from ".."
import { Result } from "../result"
import { SERVER_URL } from "../settings"

const ENDPOINT = "add_read_model"

export interface KeyFieldInput {
  key?: string
  prefix?: string
}

export interface ReadModelValidatedInput {
  name: string
  id: string
  path: string
  keyFields: KeyFieldInput[]
}

export type ReadModelValidationData = {
  name?: string
  id?: string
  path?: string
  keyFields?: string
}

export type ReadModelValidationError = ValidationError<ReadModelValidationData>

export interface ReadModelUnvalidatedInput {
  name?: string
  id?: string
  path?: string
  keyFields: {
    key?: string
    prefix?: string
  }[]
}

export function validateReadModelInput(
  data: ReadModelUnvalidatedInput
): Result<ReadModelValidatedInput, ReadModelValidationError> {
  const errors: ReadModelValidationError = { type: "validation", data: {} }

  if (!data.name) {
    errors.data.name = "Read Model name is required!"
  }
  if (!data.id) {
    errors.data.id = "Read Model id is required!"
  }
  if (!data.path) {
    errors.data.path = "Read Model path is required!"
  }

  if (data.keyFields.length === 0 || !data.keyFields[0].key) {
    errors.data.keyFields = "At least one key field must be specified!"
  }

  if (Object.keys(errors.data).length) {
    return {
      type: "err",
      data: errors,
    }
  }

  return {
    type: "ok",
    data: data as ReadModelValidatedInput,
  }
}

export type AddReadModelResult = Result<null, ReadModelValidationError>

async function addReadModel(data: ReadModelUnvalidatedInput): Promise<never | Response> {
  const validation = validateReadModelInput(data)

  switch (validation.type) {
    case "err":
      throw validation.data
    case "ok":
      const res = await fetch(SERVER_URL + ENDPOINT, {
        method: "POST",
        body: JSON.stringify(validation.data),
      })

      return res.json()
  }
}

export default addReadModel
