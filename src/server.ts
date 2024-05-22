import fastify from 'fastify'
import * as DB from './db'
import { z } from 'zod'
import { newSpanLifeCycle } from './lib/span-factory'

const server = fastify()

server.get('/ping', async (request, reply) => {
  const m = await DB.getMessages()
  reply.send(m)
})

server.post('/ping-serial', async (request, reply) => {
  // get payload from request
  const REQUEST_SCHEMA = z.object({
    text: z.string(),
  })

  const promises = Array.from({ length: 4 }, (_, i) => {
    const wait = Math.floor(Math.random() * 1000)
    return () =>
      new Promise((resolve) => {
        const lf = newSpanLifeCycle()
        lf.beforeExecution(i, { wait: String(wait) })
        setTimeout(() => {
          lf.afterExecution(i, { wait: String(wait) })
          resolve(i)
        }, wait)
      })
  })

  // execute promises in serial with reduce
  await promises.reduce<Promise<void>>(async (acc, p) => {
    await acc // Wait for the previous promise to resolve
    await p() // Execute the current promise
  }, Promise.resolve()) // Initial value is a resolved promise

  const validate = REQUEST_SCHEMA.safeParse(request.body)
  if (validate.success === false) {
    return reply.status(400).send(validate.error)
  }

  const m = await DB.createMessage(validate.data.text)
  reply.send(m)
})

server.post('/ping-parallel', async (request, reply) => {
  // get payload from request
  const REQUEST_SCHEMA = z.object({
    text: z.string(),
  })

  const promises = Array.from({ length: 4 }, (_, i) => {
    const wait = Math.floor(Math.random() * 1000)
    return () =>
      new Promise((resolve) => {
        const lf = newSpanLifeCycle()
        lf.beforeExecution(i, { wait: String(wait) })
        setTimeout(() => {
          lf.afterExecution(i, { wait: String(wait) })
          resolve(i)
        }, wait)
      })
  })

  // execute promises in parallel with Promise.all
  await Promise.all(promises.map((p) => p()))

  const validate = REQUEST_SCHEMA.safeParse(request.body)
  if (validate.success === false) {
    return reply.status(400).send(validate.error)
  }

  const m = await DB.createMessage(validate.data.text)
  reply.send(m)
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
