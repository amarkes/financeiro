import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(6),
    cpf: vine.string().minLength(11),
  })
)
