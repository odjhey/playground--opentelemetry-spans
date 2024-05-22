export type UseFunction<N, Output, Input> = {
  name: N
  fn: (input: Input) => Output
}
export type UseFunctionAsync<N, Output, Input> = {
  name: N
  fn: (input: Input) => Promise<Output>
}
