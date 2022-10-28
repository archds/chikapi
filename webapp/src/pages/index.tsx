import React from "react"
import { Button, Tile } from "react-bulma-components"
import { Route, Routes } from "react-router"
import { BrowserRouter } from "react-router-dom"
import BaseLayout from "../layout/base"

function Index() {
    return (
        <Tile kind="ancestor">
            <Tile kind="parent" size={6} vertical={false}>
                <Tile kind="child" size={12} className="box">
                    <h1 className="has-text-centered is-size-2">
                        Welcome to{" "}
                        <span className="has-text-weight-semibold has-text-link">
                            ChikAPI
                        </span>
                        .
                    </h1>
                </Tile>
            </Tile>
            <Tile kind="parent" size={6} vertical={false}>
                <Tile kind="child" size={12} className="box">
                    <p className="has-text-centered is-size-4">
                        This is UI generation tool based on custom API schema.
                    </p>
                    <p className="has-text-centered is-size-4">
                        To start choose one of navigation item.
                    </p>
                </Tile>
            </Tile>
        </Tile>
    )
}

export default Index