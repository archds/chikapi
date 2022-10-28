import { Button, Image, Level, Menu } from "react-bulma-components"
import { Link } from "react-router-dom"
import favicon from "../public/favicon/android-chrome-192x192.png"

function SidebarLayout() {
    return (
        <Menu>
            <Level renderAs={Link} to="/">
                <Level.Item>
                    <Image src={favicon} size={64} />
                </Level.Item>
                <Level.Item>
                    <h3 className="title is-2 ml-4">ChickAPI</h3>
                </Level.Item>
            </Level>
            <Menu.List title="Read Models">
                <Button size="small" color="primary">
                    Add
                </Button>
            </Menu.List>
            <Menu.List title="Commands">
                <Button size="small" color="primary">
                    Add
                </Button>
            </Menu.List>
        </Menu>
    )
}

export default SidebarLayout
