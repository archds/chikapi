import React, { createContext } from "react"
import { QueryClient, QueryClientProvider, useQuery } from "react-query"
import { BrowserRouter, Outlet, Route, Routes, ScrollRestoration } from "react-router-dom"
import Index from "."
import { fetchReadModels } from "../services/read_models"
import { ReadModel } from "../services/types"
import BaseLayout from "../layout/base"
import NotFound from "./not_found"
import ReadModelPage from "./read_model"
import { Heading, Progress } from "react-bulma-components"
import { ToastContextT } from "../components/toast"

const toastDefaults: ToastContextT = {
  color: "info",
  visible: true,
  text: "This message should not be visible",
}

type TranslationContext = Record<string, string>

export const Translation = createContext<TranslationContext>({})
export const ToastContext = createContext<ToastContextT>(toastDefaults)

function Root() {
  const { data, isLoading, isError } = useQuery("translation", async () => {
    const res = await fetch("http://localhost:8080/translation")
    return await res.json()
  })

  if (isLoading) {
    return <Progress />
  }

  if (isError || !data) {
    return <Heading textColor="danger">Error!</Heading>
  }

  return (
    <BaseLayout>
      <Translation.Provider value={data}>
        <ToastContext.Provider value={toastDefaults}>
          <Outlet />
        </ToastContext.Provider>
      </Translation.Provider>
    </BaseLayout>
  )
}

export default Root
