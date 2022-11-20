export type Ok<T> = {
  type: "ok"
  data: T
}

export type Err<E> = {
  type: "err"
  data: E
}

export type Result<T, E> = Ok<T> | Err<E>
