import vine from '@vinejs/vine'

export const createLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(6),
    remember: vine.boolean().optional(),
    device: vine.string().nullable().optional(),
  })
)
