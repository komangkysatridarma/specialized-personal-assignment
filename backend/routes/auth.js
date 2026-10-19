import { Router } from 'express'
import * as authController from '../controllers/authController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', authenticate, authController.me)

export default router
