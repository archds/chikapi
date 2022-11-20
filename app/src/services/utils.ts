export function complexObjectGet(obj: { [key: string]: any }, key: string): any {
  let buffer = obj
  let splitted = key.split(".")

  for (let i = 0; i < splitted.length; i++) {
    const node = splitted[i]
    const val = obj[node]

    switch (typeof val) {
      case "object":
        buffer = val
      default:
        return val
    }
  }

  return buffer
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
