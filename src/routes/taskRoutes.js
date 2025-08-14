import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { list, create, update, remove, addComment } from '../controllers/taskController.js'

const router = express.Router()
router.get('/', protect, list)
router.post('/', protect, create)
router.put('/:id', protect, update)
router.delete('/:id', protect, remove)
router.post('/:id/comments', protect, addComment)

export default router
