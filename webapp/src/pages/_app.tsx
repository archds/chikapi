import "../styles/globals.scss"
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BaseLayout from "../layout/base";
import Index from ".";
import NotFound from "./not_found";

function App() {
    return (
        <BrowserRouter>
            <BaseLayout>
                <Routes>
                    <Route index element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BaseLayout>
        </BrowserRouter>
    )
}

const app = document.getElementById("app");
ReactDOM.render(<App />, app);