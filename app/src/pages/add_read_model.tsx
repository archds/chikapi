import { ErrorMessage, Field, Form, Formik } from "formik"
import { FormikErrors, FormikValues } from "formik/dist/types"
import { useState } from "react"
import { Box, Button, Columns, Form as BulmaForm, Heading, Level } from "react-bulma-components"
import { useMutation, useQueryClient } from "react-query"
import KeyFieldForm from "../components/form/keyfield"
import AddReadModelForm from "../components/form/rmadd"
import { MutationError } from "../services"
import addReadModel, {
  KeyFieldInput,
  ReadModelUnvalidatedInput,
  ReadModelValidationData,
  ReadModelValidationError,
} from "../services/mutations/add_rm"

type AddReadModelFormValues = {
  name: string
  path: string
  id: string
}

const validateForm = (values: FormikValues) => {
  let errors: FormikErrors<FormikValues> = {}
  console.log(values)
  if (!values.name) {
    errors.name = "Name is required!"
  }
  return errors
}

function AddReadModelPage() {
  const queryClient = useQueryClient()
  const [input, setInput] = useState<ReadModelUnvalidatedInput>({ keyFields: [] })
  const [inputErrors, setInputErrors] = useState<ReadModelValidationError>({ type: "validation", data: {} })

  const mutation = useMutation<Response, MutationError<ReadModelValidationError>, ReadModelUnvalidatedInput>({
    mutationFn: addReadModel,
    onError: (error) => {
      switch (error.type) {
        case "validation":
          setInputErrors(error.data)
        case "network":
          console.log(error.data)
      }
    },
    onSuccess: () => {
      setInputErrors({ type: "validation", data: {} })
      queryClient.invalidateQueries({ queryKey: ["readModels"] })
    },
  })

  const initialValues: AddReadModelFormValues = {
    name: "",
    path: "",
    id: "",
  }

  const onFormSubmit = () => {
    console.log("Form submitted")
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onFormSubmit} validate={validateForm}>
      {({ isSubmitting }) => (
        <Form>
          <Box className="add-read-model-box">
            <Level>
              <Level.Side align="left">
                <Level.Item>
                  <Heading>Add Read Model</Heading>
                </Level.Item>
              </Level.Side>
              <Level.Side align="right">
                <Level.Item>
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Level.Item>
              </Level.Side>
            </Level>

            <Columns>
              <Columns.Column>
                <BulmaForm.Field>
                  <BulmaForm.Label>Name</BulmaForm.Label>
                  <BulmaForm.Control>
                    <Field name="name" placeholder="My Read Model" as={BulmaForm.Input} />
                  </BulmaForm.Control>
                    <ErrorMessage name="name" component={BulmaForm.Help} />
                </BulmaForm.Field>
                <BulmaForm.Field>
                  <BulmaForm.Label>Path</BulmaForm.Label>
                  <BulmaForm.Control>
                    <BulmaForm.Input name="path" placeholder="/route/url" />
                  </BulmaForm.Control>
                  <BulmaForm.Help color="danger">
                    <ErrorMessage name="path" />
                  </BulmaForm.Help>
                </BulmaForm.Field>
              </Columns.Column>
              <Columns.Column>
                <BulmaForm.Field>
                  <BulmaForm.Label>ID</BulmaForm.Label>
                  <BulmaForm.Control>
                    <BulmaForm.Input name="id" placeholder="any-string-without-spaces" />
                  </BulmaForm.Control>
                  <BulmaForm.Help color="danger">
                    <ErrorMessage name="id" />
                  </BulmaForm.Help>
                </BulmaForm.Field>
              </Columns.Column>
            </Columns>
            <BulmaForm.Field>
              <BulmaForm.Label>Key Fields</BulmaForm.Label>
              Something must be here! Something must be here!
            </BulmaForm.Field>
            <Button color="link" size="small" type="button" disabled={isSubmitting}>
              Add
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default AddReadModelPage
