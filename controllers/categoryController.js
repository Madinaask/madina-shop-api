import Category from '../models/Category.js'

export async function list(req, res) {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getOne(req, res) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ error: 'Категория не найдена' })
    res.json(category)
  } catch (error) {
    res.status(400).json({ error: 'Некорректный идентификатор' })
  }
}

export async function create(req, res) {
  try {
    const { name, description } = req.body
    const category = await Category.create({ name, description })
    res.status(201).json(category)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Категория с таким именем уже существует' })
    }
    res.status(400).json({ error: error.message })
  }
}

export async function update(req, res) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ error: 'Категория не найдена' })

    if (req.body.name !== undefined) category.name = req.body.name
    if (req.body.description !== undefined) category.description = req.body.description

    await category.save()
    res.json(category)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Категория с таким именем уже существует' })
    }
    res.status(400).json({ error: error.message })
  }
}

export async function remove(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ error: 'Категория не найдена' })
    res.json({ message: 'Категория удалена', category })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
