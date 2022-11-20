import { Notification } from "react-bulma-components"
import { Color } from "react-bulma-components/src/components"

interface ToastProps {
  text: string
  color: Color
  visible: boolean
}

export interface ToastContextT extends ToastProps {}

function Toast(props: ToastProps) {
  return <Notification color={props.color}>{props.text}</Notification>
}

export default Toast
