import vine from '@vinejs/vine'
import { StatusUser } from '../enums/status_user.js'
import { Role } from '../enums/rules.js'

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(6),
    bloc: vine.string(),
    apartment: vine.string(),
    phone: vine.string().minLength(11),
    gender: vine.string().in(['M', 'F', 'U']),
    birthDate: vine.date(),
    cpf: vine.string().minLength(1),
    tenant: vine.string(),
    status: vine.enum(StatusUser),
    role: vine.enum(Role),
  })
)
