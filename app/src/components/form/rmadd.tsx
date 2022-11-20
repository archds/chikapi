import React, { useEffect, useState } from "react"
import { Button, Columns, Form } from "react-bulma-components"
import { KeyFieldInput, ReadModelValidationData, ReadModelValidationError } from "../../services/mutations/add_rm"
import KeyFieldForm from "./keyfield"

type ValidationField = keyof ReadModelValidationData

interface AddReadModelFormProps {
  errors?: ReadModelValidationError
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPathChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyFieldsChange: (keyFields: KeyFieldInput[]) => void
}

function AddReadModelForm(props: AddReadModelFormProps) {
  const [keyFields, setKeyFields] = useState<KeyFieldInput[]>([{}])
  const keyFieldActions = {
    add: () => setKeyFields([...keyFields, {}]),
    remove: () => setKeyFields(keyFields.slice(0, -1)),
    insertData: (obj: KeyFieldInput, index: number) => {
      const temp = keyFields
      temp[index] = obj
      setKeyFields(temp)
    },
  }

  useEffect(() => {
    props.onKeyFieldsChange(keyFields)
  }, [keyFields])

  let formHelpers: Partial<Record<ValidationField, JSX.Element>> = {}

  if (props.errors) {
    Object.keys(props.errors.data).map((k) => {
      let key = k as ValidationField
      let errors = (props.errors as ReadModelValidationError).data
      formHelpers[key] = <Form.Help color="danger">{errors[key]}</Form.Help>
    })
  }

  const keyFieldInputs = keyFields.map((obj, i) => {
    return (
      <KeyFieldForm
        index={i}
        key={i}
        handleRemove={keyFieldActions.remove}
        handleDataChange={keyFieldActions.insertData}
      />
    )
  })

  return (
    <>
      <Columns>
        <Columns.Column>
          <Form.Field>
            <Form.Label>Name</Form.Label>
            <Form.Control>
              <Form.Input name="name" placeholder="My Read Model" onChange={props.onNameChange} />
            </Form.Control>
            {formHelpers.name}
          </Form.Field>
          <Form.Field>
            <Form.Label>Path</Form.Label>
            <Form.Control>
              <Form.Input name="path" placeholder="/route/url" onChange={props.onPathChange} />
            </Form.Control>
            {formHelpers.path}
          </Form.Field>
        </Columns.Column>
        <Columns.Column>
          <Form.Field>
            <Form.Label>ID</Form.Label>
            <Form.Control>
              <Form.Input name="id" placeholder="any-string-without-spaces" onChange={props.onIdChange} />
            </Form.Control>
            {formHelpers.id}
          </Form.Field>
        </Columns.Column>
      </Columns>
      <Form.Field>
        <Form.Label>Key Fields</Form.Label>
        {formHelpers.keyFields}
        {keyFieldInputs}
      </Form.Field>
      <Button color="link" size="small" type="button" onClick={keyFieldActions.add}>
        Add
      </Button>
    </>
  )
}

export default AddReadModelForm
