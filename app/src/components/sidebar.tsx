import { useContext } from "react"
import { Button, Image, Level, Menu } from "react-bulma-components"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { fetchReadModels } from "../services/read_models"
import { Command, ReadModel } from "../services/types"
import ReadModelPage from "../pages/read_model"
import favicon from "../public/favicon/android-chrome-192x192.png"

function renderListItem(item: ReadModel): JSX.Element {
    return (
        <Menu.List.Item key={item.id} renderAs={Link} to={`rm/${item.id}`}>
            {item.name}
        </Menu.List.Item>
    )
}

function SidebarLayout() {
    const read_models = useQuery<ReadModel[], Error>(
        "readModels",
        fetchReadModels
    )
    let read_models_elements: JSX.Element[]

    if (read_models.isLoading) {
        return <></>
    }

    if (read_models.isError) {
        return <></>
    }

    if (read_models.data) {
        read_models_elements = read_models.data.map(renderListItem)
    } else {
        read_models_elements = []
    }

    const commands: JSX.Element[] = []

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
                {read_models_elements}
                <Menu.List.Item>
                    <Button size="small" color="primary">
                        Add
                    </Button>
                </Menu.List.Item>
            </Menu.List>
            <Menu.List title="Commands">
                {commands}
                <Menu.List.Item>
                    <Button size="small" color="primary">
                        Add
                    </Button>
                </Menu.List.Item>
            </Menu.List>
        </Menu>
    )
}

export default SidebarLayout
