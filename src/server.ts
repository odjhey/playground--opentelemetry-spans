import { trace } from '@opentelemetry/api'
import { api } from '@opentelemetry/sdk-node'
import fastify from 'fastify'
import * as DB from './db'

const server = fastify()

const tracer = trace.getTracer('custom-tracer-19387')

server.get('/ping', async (request, reply) => {
  const span = api.trace.getSpan(api.context.active())
  span?.setAttribute('custom-attribute-asdfl123', 'custom-value-9o8uc')

  const m = await DB.getMessages()

  if (span) {
    await new Promise((res) => {
      const childSpan = tracer.startSpan(
        'new-span',
        undefined,
        api.context.active()
      )

      setTimeout(() => {
        childSpan.setAttribute('kuku2', 'lala')
        childSpan.end()
        res({})
      }, 1000)
    })
    return 'pongers'
  } else {
    return 'pong\n'
  }
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
