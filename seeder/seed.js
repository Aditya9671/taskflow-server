import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../src/models/User.js'
import Task from '../src/models/Task.js'

dotenv.config()

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow')
  await User.deleteMany(); await Task.deleteMany();

  const admin = await User.create({ name: 'Aditya', email: 'aditya@taskflow.dev', password: 'Aditya@123' })
  const demo  = await User.create({ name: 'Demo User', email: 'demo@taskflow.dev', password: 'Demo@123' })

  await Task.insertMany([
    { title: 'Build landing page', description: 'Hero, features, CTA', status: 'in-progress', priority: 'high', tags: ['frontend'], assignees: [admin._id], createdBy: admin._id },
    { title: 'Design Mongo schemas', description: 'Users, Tasks', status: 'todo', priority: 'medium', tags: ['backend'], assignees: [demo._id], createdBy: admin._id },
    { title: 'Deploy to Vercel/Render', description: 'Env vars, domain', status: 'todo', priority: 'low', tags: ['devops'], assignees: [admin._id, demo._id], createdBy: admin._id }
  ])

  console.log('Seeded users & tasks')
  process.exit(0)
}

run().catch(e=>{ console.error(e); process.exit(1) })
