import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

export async function register(req, res) {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' })
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user)
    res.status(201).json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    const ok = await user.comparePassword(password)
    if (!ok) {
      return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    const token = generateToken(user)
    res.json({ user, token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
