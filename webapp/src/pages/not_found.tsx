import { Block, Image } from "react-bulma-components"
import taken from "../public/icons/taken.svg"

function NotFound() {
    return (
        <>
            <Block
                alignItems="center"
                className="is-flex"
                flexDirection="column"
            >
                <Image size={512} src={taken} />
                <h1 className="is-size-1 has-text-weight-semibold">
                    Not found
                </h1>
            </Block>
        </>
    )
}

export default NotFound
