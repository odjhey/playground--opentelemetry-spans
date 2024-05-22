import { Span, trace } from '@opentelemetry/api'
import { Interceptor } from 'slonik'

export const newTracingInterceptor: () => Interceptor = () => {
  let span: Span

  return {
    beforeQueryExecution: (context, query) => {
      const tracer = trace.getTracer('default')
      span = tracer.startSpan('db.query', {
        attributes: {
          'db.statement': query.sql,
          'db.parameters': JSON.stringify(query.values),
        },
      })
      return null
    },
    afterQueryExecution: (context, query, result) => {
      if (span) {
        span.setAttribute('db.row_count', result.rowCount)
        span.end()
      }

      return null
    },
    queryExecutionError: (context, query, error) => {
      if (span) {
        span.recordException(error)
        span.end()
      }
      throw error
    },
  }
}
