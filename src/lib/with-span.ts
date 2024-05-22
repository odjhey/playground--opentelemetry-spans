import { newSpanLifeCycle } from './span-factory'

type AnyFunction = (...args: any[]) => Promise<any>

export const withSpan = <T extends AnyFunction[]>(...fns: T): T => {
  return fns.map((fn) => {
    return ((...args: Parameters<typeof fn>) => {
      const lf = newSpanLifeCycle()
      lf.beforeExecution(
        { span: { title: 'business-logic' } },
        { args: JSON.stringify(args) }
      )
      const result = fn(...args).then((r) => {
        lf.afterExecution(undefined, { result: JSON.stringify(r) })
        return r
      })
      return result
    }) as typeof fn
  }) as T
}
