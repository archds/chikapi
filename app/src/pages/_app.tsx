import React from "react"
import { useQuery } from "react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Index from "."
import { fetchReadModels } from "../services/read_models"
import { ReadModel } from "../services/types"
import BaseLayout from "../layout/base"
import NotFound from "./not_found"
import ReadModelPage from "./read_model"

function App() {
    return (
        <BrowserRouter>
            <BaseLayout>
                <Routes>
                    <Route index element={<Index />} />
                    <Route element={<ReadModelPage />} path="rm/:id" />
                    <Route element={<NotFound />} path="rm/not_fount" />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BaseLayout>
        </BrowserRouter>
    )
}

export default App
