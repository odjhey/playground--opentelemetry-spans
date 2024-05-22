import { Span, trace } from '@opentelemetry/api'

type DefaultContext = { span: { title: string } }
type SpanLifeCycle<
  Context extends DefaultContext,
  Attr extends Record<string, string>
> = {
  // @todo move context to end
  beforeExecution: (context: Context | undefined, attr: Partial<Attr>) => void
  afterExecution: (context: Context | undefined, attr: Partial<Attr>) => void
  onExecutionError: (context: Context, error: Error) => void
}

export const newSpanLifeCycle: <
  T extends DefaultContext,
  A extends Record<string, string>
>() => SpanLifeCycle<T, A> = () => {
  let span: Span

  return {
    beforeExecution: (context, attr) => {
      const tracer = trace.getTracer('default')
      span = tracer.startSpan(context?.span.title ?? 'custom.attr', {
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
