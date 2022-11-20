import { useEffect, useState } from "react"
import { Button, Columns, Form } from "react-bulma-components"
import { KeyFieldInput } from "../../services/mutations/add_rm"

interface KeyFieldFormProps {
  handleRemove: () => void
  handleDataChange: (obj: KeyFieldInput, index: number) => void
  index: number
}

function KeyFieldForm(props: KeyFieldFormProps) {
  const [data, setData] = useState<KeyFieldInput>({})
  const [kfNameName, kfPrefixName] = [`keyFieldKey-${props.index}`, `keyFieldPrefix-${props.index}`]

  useEffect(() => {
    props.handleDataChange(data, props.index)
  }, [data])

  return (
    <Columns>
      <Columns.Column>
        <Form.Control>
          <Form.Input
            name={kfNameName}
            placeholder="Key"
            onChange={(e) =>
              setData({
                ...data,
                key: e.target.value || undefined,
              })
            }
          />
        </Form.Control>
      </Columns.Column>
      <Columns.Column>
        <Form.Control>
          <Form.Input
            name={kfPrefixName}
            type="text"
            placeholder="Prefix"
            onChange={(e) =>
              setData({
                ...data,
                prefix: e.target.value || undefined,
              })
            }
          />
        </Form.Control>
      </Columns.Column>
      <Columns.Column size={1}>
        <Button onClick={props.handleRemove} disabled={!props.index}>
          X
        </Button>
      </Columns.Column>
    </Columns>
  )
}

export default KeyFieldForm
