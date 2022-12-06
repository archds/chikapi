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
import { API_ROOT } from "../services/settings"
import FullScreenLoader from "../components/loader"
import { toast, ToastContainer } from "react-toastify"

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
    const res = await fetch(`${API_ROOT}/translation`)
    return await res.json()
  })

  if (isLoading) {
    toast.loading("Loading translations...", {
      hideProgressBar: true,
      draggable: false,
      closeOnClick: false,
      position: "bottom-center"
    })
  } else {
    toast.dismiss()
  }

  if (isError) {
    return <Heading textColor="danger">Error!</Heading>
  }

  return (
    <BaseLayout>
      <Translation.Provider value={data}>
        <ToastContext.Provider value={toastDefaults}>
          <Outlet />
        </ToastContext.Provider>
      </Translation.Provider>
      <ToastContainer />
    </BaseLayout>
  )
}

export default Root
