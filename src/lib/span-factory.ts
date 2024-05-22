import { Span, trace } from '@opentelemetry/api'

type SpanLifeCycle<Context, Attr extends Record<string, string>> = {
  beforeExecution: (context: Context, attr: Partial<Attr>) => void
  afterExecution: (context: Context, attr: Partial<Attr>) => void
  onExecutionError: (context: Context, error: Error) => void
}

export const newSpanLifeCycle: <
  T,
  A extends Record<string, string>
>() => SpanLifeCycle<T, A> = () => {
  let span: Span

  return {
    beforeExecution: (context, attr) => {
      const tracer = trace.getTracer('default')
      span = tracer.startSpan('custom.attr', {
        attributes: { ...attr },
      })
      return null
    },
    afterExecution: (context, attr) => {
      if (span) {
        span.setAttributes(attr)
        span.end()
      }

      return null
    },

    onExecutionError: (context, error) => {
      if (span) {
        span.recordException(error)
        span.end()
      }
      throw error
    },
  }
}
