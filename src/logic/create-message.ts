import { z } from 'zod'
import { UseFunctionAsync } from './types'

const MessageSchema = z.object({ id: z.string(), text: z.string() })
// pick
const CreateSchema = MessageSchema.pick({ text: true })

export const makeCreateMessage = (input: z.input<typeof CreateSchema>) => {
  type CreateMessage = UseFunctionAsync<
    'createMessage',
    z.output<typeof MessageSchema>,
    z.input<typeof CreateSchema>
  >

  const fn = async ({ deps }: { deps: [CreateMessage] }) => {
    const [createMessage] = deps
    const message = await createMessage.fn({ text: input.text })
    return [message] as const
  }

  return [fn] as const
}
