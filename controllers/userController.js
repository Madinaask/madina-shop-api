import User from '../models/User.js'
import Product from '../models/Product.js'
import Review from '../models/Review.js'

export async function list(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getOne(req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: 'Некорректный идентификатор' })
  }
}

export async function updateMe(req, res) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' })

    const { name, email, password } = req.body
    if (name !== undefined) user.name = name
    if (email !== undefined) user.email = email
    if (password !== undefined) user.password = password

    await user.save()
    res.json(user)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email уже занят' })
    }
    res.status(400).json({ error: error.message })
  }
}

export async function adminUpdate(req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' })

    const { name, email, password, role } = req.body
    if (name !== undefined) user.name = name
    if (email !== undefined) user.email = email
    if (password !== undefined) user.password = password
    if (role !== undefined) user.role = role

    await user.save()
    res.json(user)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email уже занят' })
    }
    res.status(400).json({ error: error.message })
  }
}

export async function remove(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
    await Review.deleteMany({ user: user._id })
    res.json({ message: 'Пользователь удалён', user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function getWishlist(req, res) {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name slug' },
    })
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
    res.json(user.wishlist)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function addToWishlist(req, res) {
  try {
    const product = await Product.findById(req.params.productId)
    if (!product) return res.status(404).json({ error: 'Товар не найден' })

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: product._id } },
      { new: true }
    ).populate('wishlist', 'title price image')

    res.json(user.wishlist)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: req.params.productId } },
      { new: true }
    ).populate('wishlist', 'title price image')

    if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
    res.json(user.wishlist)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
