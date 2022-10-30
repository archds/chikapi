import { Container, Navbar } from "react-bulma-components"

function Navigation() {
    return (
        <Navbar className="has-shadow">
            <Container breakpoint="fluid">
                <Navbar.Menu>
                    <Navbar.Container align="left"></Navbar.Container>
                    <Navbar.Container align="right">
                        <Navbar.Item className="is-hoverable">
                            <Navbar.Link>More</Navbar.Link>
                            <Navbar.Dropdown right={true}>
                                <Navbar.Item>About</Navbar.Item>
                                <Navbar.Item>Documentation</Navbar.Item>
                                <Navbar.Item>Contact</Navbar.Item>
                                <Navbar.Divider />
                                <Navbar.Item>Report an issue</Navbar.Item>
                            </Navbar.Dropdown>
                        </Navbar.Item>
                    </Navbar.Container>
                </Navbar.Menu>
            </Container>
        </Navbar>
    )
}

export default Navigation
