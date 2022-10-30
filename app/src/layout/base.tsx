import { ReactNode } from "react"
import { Block, Columns } from "react-bulma-components"
import Navigation from "../components/navigation"
import SidebarLayout from "../components/sidebar"

interface Props {
    children: ReactNode
}

function BaseLayout(props: Props) {
    return (
        <Columns>
            <Columns.Column
                size="one-fifth"
                className="section sidebar-layout has-shadow box"
            >
                <SidebarLayout />
            </Columns.Column>
            <Columns.Column className="pl-0">
                <header>
                    <Navigation />
                </header>
                <div className="content-layout has-background-white-bis">
                    <Block>{props.children}</Block>
                </div>
            </Columns.Column>
        </Columns>
    )
}

export default BaseLayout
