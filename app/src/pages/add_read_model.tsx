import { useState } from "react"
import { Box, Button, Form, Heading, Level } from "react-bulma-components"
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

  return (
    <Box className="add-read-model-box">
      <Level>
        <Level.Side align="left">
          <Level.Item>
            <Heading>Add Read Model</Heading>
          </Level.Item>
        </Level.Side>
        <Level.Side align="right">
          <Level.Item>
            <Button color="primary" type="submit" onClick={() => mutation.mutate(input)} loading={mutation.isLoading}>
              Submit
            </Button>
          </Level.Item>
        </Level.Side>
      </Level>
      <AddReadModelForm
        errors={inputErrors}
        onIdChange={(e) => setInput({ ...input, id: e.target.value })}
        onNameChange={(e) => setInput({ ...input, name: e.target.value })}
        onPathChange={(e) => setInput({ ...input, path: e.target.value })}
        onKeyFieldsChange={(kfs) => setInput({ ...input, keyFields: kfs })}
      />
    </Box>
  )
}

export default AddReadModelPage
