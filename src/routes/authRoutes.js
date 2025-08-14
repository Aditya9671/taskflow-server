import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { register, login, me, logout } from '../controllers/authController.js'

const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, me)
router.post('/logout', protect, logout)

export default router
