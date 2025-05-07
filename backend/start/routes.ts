import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const LoginController = () => import('#controllers/login_controller')
const TokensController = () => import('#controllers/tokens_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

// router.resource('/api/users', UsersController).apiOnly().use(middleware.auth())
router.group(() => {
  router.post('/api/auth/login', [LoginController, 'store'])
  router.delete('/api/auth/destroy', [LoginController, 'destroy']).use(middleware.users())
  router.get('/api/auth/me', [LoginController, 'show']).use(middleware.users())
})

router
  .group(() => {
    router.resource('/api/users', UsersController).apiOnly()
  })
  .use(middleware.users())

router.group(() => {
  router.delete('/tokens/cleanup', [TokensController, 'cleanup']).use(middleware.auth())
})
