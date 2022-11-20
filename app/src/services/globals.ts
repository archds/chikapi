export interface AppError<T> {
  type: string
  data: T
}
