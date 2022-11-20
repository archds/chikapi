import Icon from "../../public/icons/question-mark.svg"

interface QuestionMarkProps {
  text: string
}

function QuestionMark(props: QuestionMarkProps) {
  return (
    <span className="question-tooltip has-tooltip-primary" data-tooltip={props.text}>
      <Icon />
    </span>
  )
}

export default QuestionMark
