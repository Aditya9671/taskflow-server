import asyncHandler from 'express-async-handler'
import Task from '../models/Task.js'

const broadcast = (req) => {
  const io = req.app.get('io')
  io.emit('tasksUpdated')
}

export const list = asyncHandler(async (req, res) => {
  const { q = '', status = '', tag = '', assignee = '' } = req.query
  const filters = { $and: [] }
  if (q) filters.$and.push({ title: { $regex: q, $options: 'i' } })
  if (status) filters.$and.push({ status })
  if (tag) filters.$and.push({ tags: tag })
  if (assignee) filters.$and.push({ assignees: assignee })
  const query = filters.$and.length ? filters : {}
  const tasks = await Task.find(query).populate('assignees', 'name email').populate('createdBy','name email').sort({ createdAt: -1 })
  res.json(tasks)
})

export const create = asyncHandler(async (req, res) => {
  const t = await Task.create({ ...req.body, createdBy: req.user._id })
  broadcast(req)
  res.status(201).json(t)
})

export const update = asyncHandler(async (req, res) => {
  const t = await Task.findById(req.params.id)
  if (!t) { res.status(404); throw new Error('Task not found') }
  const fields = ['title','description','status','priority','tags','dueDate','assignees']
  fields.forEach(f => { if (req.body[f] !== undefined) t[f] = req.body[f] })
  await t.save()
  broadcast(req)
  res.json(t)
})

export const remove = asyncHandler(async (req, res) => {
  const t = await Task.findById(req.params.id)
  if (!t) { res.status(404); throw new Error('Task not found') }
  await t.deleteOne()
  broadcast(req)
  res.json({ message: 'Task removed' })
})

export const addComment = asyncHandler(async (req, res) => {
  const t = await Task.findById(req.params.id)
  if (!t) { res.status(404); throw new Error('Task not found') }
  t.comments.push({ user: req.user._id, text: req.body.text })
  await t.save()
  broadcast(req)
  res.status(201).json({ message: 'Comment added' })
})
