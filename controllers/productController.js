import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Review from '../models/Review.js'

export async function list(req, res) {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ]
    }
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getOne(req, res) {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('createdBy', 'name email')
    if (!product) return res.status(404).json({ error: 'Товар не найден' })

    const [agg] = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])

    res.json({
      ...product.toObject(),
      averageRating: agg ? Math.round(agg.avg * 10) / 10 : 0,
      reviewCount: agg ? agg.count : 0,
    })
  } catch (error) {
    res.status(400).json({ error: 'Некорректный идентификатор' })
  }
}

export async function create(req, res) {
  try {
    const { title, description, price, stock, image, category } = req.body

    const cat = await Category.findById(category)
    if (!cat) return res.status(400).json({ error: 'Категория не найдена' })

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      image,
      category,
      createdBy: req.user.id,
    })
    const populated = await product.populate('category', 'name slug')
    res.status(201).json(populated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function update(req, res) {
  try {
    if (req.body.category) {
      const cat = await Category.findById(req.body.category)
      if (!cat) return res.status(400).json({ error: 'Категория не найдена' })
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug')

    if (!product) return res.status(404).json({ error: 'Товар не найден' })
    res.json(product)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function remove(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ error: 'Товар не найден' })
    res.json({ message: 'Товар удалён', product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
