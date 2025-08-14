import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import { generateToken } from '../config/generateToken.js'

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const exists = await User.findOne({ email })
  if (exists) { res.status(400); throw new Error('User already exists') }
  const user = await User.create({ name, email, password })
  const token = generateToken(user._id)
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
  res.status(201).json({ _id:user._id, name:user.name, email:user.email, token })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && await user.matchPassword(password)) {
    const token = generateToken(user._id)
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
    res.json({ _id:user._id, name:user.name, email:user.email, token })
  } else { res.status(401); throw new Error('Invalid email or password') }
})

export const me = asyncHandler(async (req, res) => {
  res.json(req.user)
})

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})
