export async function fetchReadModels() {
  const res = await fetch("http://localhost:8080/rms")

  return await res.json()
}

export async function fetchReadModelData(id: string) {
  const res = await fetch(`http://localhost:8080/rm/${id}`)

  return await res.json()
}
