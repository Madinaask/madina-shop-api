import Review from '../models/Review.js'
import Product from '../models/Product.js'

export async function listByProduct(req, res) {
  try {
    const { productId } = req.params
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(400).json({ error: 'Некорректный идентификатор товара' })
  }
}

export async function create(req, res) {
  try {
    const { productId } = req.params
    const { rating, comment } = req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ error: 'Товар не найден' })

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    })
    const populated = await review.populate('user', 'name')
    res.status(201).json(populated)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Вы уже оставили отзыв на этот товар' })
    }
    res.status(400).json({ error: error.message })
  }
}

export async function updateOwn(req, res) {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ error: 'Отзыв не найден' })
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Можно редактировать только свои отзывы' })
    }
    if (req.body.rating !== undefined) review.rating = req.body.rating
    if (req.body.comment !== undefined) review.comment = req.body.comment
    await review.save()
    const populated = await review.populate('user', 'name')
    res.json(populated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function removeOwnOrAdmin(req, res) {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ error: 'Отзыв не найден' })
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Нет прав на удаление' })
    }
    await review.deleteOne()
    res.json({ message: 'Отзыв удалён' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
