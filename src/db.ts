import { z } from 'zod'
import { CONFIG } from './config'
import { createPool, createSqlTag } from 'slonik'
import { newTracingInterceptor } from './db/tracing-interceptors'

const url = `postgres://${CONFIG.postgres.user}:${CONFIG.postgres.password}@${CONFIG.postgres.host}:${CONFIG.postgres.port}/${CONFIG.postgres.database}`
const newPool = async () => {
  const interceptor = newTracingInterceptor()
  return createPool(url, {
    // use interceptors to trace queries with opentelemetry
    interceptors: [interceptor],
  })
}

const sql = createSqlTag({
  typeAliases: {
    message: z.object({
      id: z.string(),
      text: z.string(),
    }),
  },
})

// get messages
export const getMessages = async () => {
  const messages = (await newPool()).many(
    sql.typeAlias('message')`SELECT * from message`
  )
  return messages
}

// create message
export const createMessage = async (text: string) => {
  const message = (await newPool()).one(
    sql.typeAlias(
      'message'
    )`INSERT INTO message (text) VALUES (${text}) RETURNING *`
  )
  return message
}
