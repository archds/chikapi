import { API_ROOT } from "./settings"

export async function fetchReadModels() {
  const res = await fetch(`${API_ROOT}/rms`)

  return await res.json()
}

export async function fetchReadModelData(id: string) {
  const res = await fetch(`${API_ROOT}/rm/${id}`)

  return await res.json()
}
